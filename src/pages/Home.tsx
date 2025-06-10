import { Box, Container, Heading, Text, Button, SimpleGrid, Icon, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaRobot, FaFileAlt, FaDownload } from 'react-icons/fa';

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box bg="blue.500" color="white" py={20}>
        <Container maxW="1200px">
          <VStack spacing={6} align="center" textAlign="center">
            <Heading size="2xl">
              Generate YouTube Captions with AI
            </Heading>
            <Text fontSize="xl" maxW="600px">
              Transform your YouTube videos with accurate, AI-generated captions and subtitles.
              Perfect for accessibility and reaching a global audience.
            </Text>
            <Button
              as={RouterLink}
              to="/signup"
              size="lg"
              colorScheme="whiteAlpha"
              mt={4}
            >
              Get Started
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="1200px" py={20}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Feature
            icon={FaRobot}
            title="AI-Powered"
            description="Advanced AI technology generates accurate captions for your videos"
          />
          <Feature
            icon={FaFileAlt}
            title="Multiple Formats"
            description="Export captions in various formats including SRT, VTT, and more"
          />
          <Feature
            icon={FaDownload}
            title="Easy Download"
            description="Download your captions instantly and use them right away"
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

interface FeatureProps {
  icon: any;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <VStack spacing={4} align="center" textAlign="center">
      <Icon as={icon} w={10} h={10} color="blue.500" />
      <Heading size="md">{title}</Heading>
      <Text color="gray.600">{description}</Text>
    </VStack>
  );
} 