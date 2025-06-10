import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
} from '@chakra-ui/react';
import { User, CaptionRequest, supabase } from '../lib/supabase';
import { generateCaptions } from '../lib/gemini';
import AmazonPayButton from '../components/AmazonPayButton';
import { createCheckoutSession, completeCheckout } from '../lib/amazonPay';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<CaptionRequest[]>([]);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('caption_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch requests',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setRequests(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create checkout session
      const { checkoutSessionId: sessionId } = await createCheckoutSession(4.99); // $4.99 per caption generation
      setCheckoutSessionId(sessionId);

      // Create request record
      const { data: request, error: createError } = await supabase
        .from('caption_requests')
        .insert([
          {
            user_id: user.id,
            video_url: videoUrl,
            status: 'processing',
          },
        ])
        .select()
        .single();

      if (createError) throw createError;

      // Generate captions
      const captions = await generateCaptions(videoUrl);

      // Update request with results
      const { error: updateError } = await supabase
        .from('caption_requests')
        .update({
          status: 'completed',
          result: captions,
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Complete checkout
      await completeCheckout(sessionId);

      toast({
        title: 'Success',
        description: 'Captions generated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setVideoUrl('');
      fetchRequests();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'processing':
        return 'yellow';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Container maxW="1200px" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading>Generate Captions</Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>YouTube Video URL</FormLabel>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              alignSelf="flex-start"
            >
              Generate Captions
            </Button>
          </VStack>
        </Box>

        {checkoutSessionId && (
          <Box>
            <Text mb={4}>Complete your payment to generate captions:</Text>
            <AmazonPayButton
              amount={4.99}
              onSuccess={() => {
                toast({
                  title: 'Payment Successful',
                  description: 'Your captions will be generated shortly.',
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                });
              }}
              onError={(error) => {
                toast({
                  title: 'Payment Error',
                  description: error.message,
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
              }}
            />
          </Box>
        )}

        <Box>
          <Heading size="md" mb={4}>
            Your Requests
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Video URL</Th>
                <Th>Status</Th>
                <Th>Created</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {requests.map((request) => (
                <Tr key={request.id}>
                  <Td>
                    <Link href={request.video_url} isExternal color="blue.500">
                      {request.video_url}
                    </Link>
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </Td>
                  <Td>
                    {new Date(request.created_at).toLocaleDateString()}
                  </Td>
                  <Td>
                    {request.status === 'completed' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          const blob = new Blob([request.result || ''], {
                            type: 'text/plain',
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'captions.srt';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Download
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
} 