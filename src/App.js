import React, { Component } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Text,
  Flex,
  Image,
  Card,
  CardBody,
  Divider,
  Link,
  HStack,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { readString } from 'react-papaparse';
import csvContent from './epss_scores-current.csv';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cveData: [],
      loading: true,
      cveIdentifier: '',
      epssScore: null,
      percentile: null,
      formError: null,
    };
  }

  componentDidMount() {
    this.readCsvFile();
  }

  handleInputChange = (event) => {
    this.setState({ cveIdentifier: event.target.value });

  };

  readCsvFile = () => {
    readString(
      csvContent, 
      {
        download: true,
        header: true,
        comments: true,
        complete: (results, file) => {
          this.setState({
            cveData: results.data
          })
        },
        error: (error, file) => {
          console.log('Error while parsing:', error, file);
        },
      }
    );
  };

  calculateEPSS = () => {
    this.setState({ epssScore: null, percentile: null });
    const { cveIdentifier, cveData } = this.state;

    const cvePattern = /^CVE-\d{4}-\d{4,}$/;
    if(cveIdentifier == null || cvePattern.test(cveIdentifier) === false) {
      this.setState({ formError: 'Provide a valid CVE identifier!' });
      return;
    }
    this.setState({ formError: null });

    const cveEntry = cveData.find((item) => item.cve === cveIdentifier.trim());

    if (!cveEntry)
      this.setState({ formError: 'There is no matching CVE!' });
    else
      this.setState({epssScore: cveEntry.epss, percentile: cveEntry.percentile});
  }

  render() {
    const { cveIdentifier, epssScore, percentile } = this.state;

    return (
      <Flex direction="column" minHeight="100vh">
        
        <Flex
          backgroundColor="#08090F"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            maxW={"800px"}
            mx={"auto"}
            py="10px"
          >
            <Box
              float={"left"}
            >
              <Image 
                src={require('./logo.webp')}
                alt="EPSS Calculator"
                height="70px"
                float={"left"}
              />
              <Heading
                fontSize="27px"
                color="#fff"
                float="left"
                fontWeight="semibold"
                pt="20px"
              >
                EPSS Calculator
              </Heading>
            </Box>
            <Box>

            </Box>
          </Box>
        </Flex>
        <Box
          maxW="800px"
          mx="auto"
          flex="1"
          p="15px"
        >
          <Card
            mt={"50px"}
            padding={"15px"}
          >
            <CardBody>
              <VStack 
                spacing={4}
                maxW={"md"}
                mx="auto"
              >
                <FormControl id="cve-identifier">
                  <FormLabel color={"purple"}>CVE Identifier</FormLabel>
                  <Input
                    type="text"
                    placeholder="e.g. CVE-2021-44228"
                    value={this.state.cveIdentifier} // Bind the input value to the state
                    onChange={this.handleInputChange} // Update state when input changes
                  />
                  {this.state.formError && (
                    <Text
                      color={"#9B2C2C"}
                      size="sm"
                    >
                      {this.state.formError}
                    </Text>
                  )}
                </FormControl>

                <Button
                  colorScheme="purple"
                  size="md"
                  onClick={() => { this.calculateEPSS() } }
                >
                  Calculate
                </Button>

                {epssScore && percentile && (
                  <Box mt={6} textAlign="left" w={"100%"}>
                    <Divider mb={6} />
                    <Heading
                      as="h5"
                      size="sm"
                      fontWeight={"500"}
                      mb="15px"
                      color={"purple"}
                    >
                      Results
                    </Heading>

                    <Text fontSize="md">
                      <b>EPSS Score:</b> {epssScore}
                    </Text>
                    <Text fontSize="md">
                      <b>Percentile:</b> {percentile}
                    </Text>
                    <Text color={"gray"} mt="10px">
                      <HStack>
                        <InfoIcon color="purple" mr="5px" /> 
                        <Text>
                          Percentile means that the vulnerability has a higher likelihood of exploitation in the wild than ~{Math.round(percentile * 10000)/100 }% of all other CVEs.
                        </Text>
                      </HStack>
                    </Text>

                  </Box>
                )}
              </VStack>
              </CardBody>
            </Card>

          <Card
            mt="20px"
            color={"gray"}
          >
            <CardBody>
              <Text>
                <b>The Exploit Prediction Scoring System (EPSS)</b> is a data-driven effort for estimating the likelihood (probability) that a software vulnerability will be exploited in the wild.
              </Text>
              <Text
                mt="10px"
              >
                More details about EPSS can be found on FIRST <Link href="https://www.first.org/epss/model" color={"purple"} target="_blank">dedicated website</Link>. 
              </Text>
              <Text mt="30px">
                If you're looking for a practical usage of EPSS, you might be interested in <Link href="https://devsec-blog.com/2024/04/prioritising-vulnerabilities-remedial-actions-at-scale-with-epss/" color={"purple"} target="_blank">Prioritising Vulnerabilities Remedial Actions at Scale with EPSS</Link>.
              </Text>
            </CardBody>
          </Card>
        </Box>

        <Flex
          as="footer"
          mt={10}
          p={4}
          backgroundColor="#19191C"
          justifyContent="center"
          alignItems="center"
        >
          <HStack 
            maxW={"800px"}
            mx={"auto"}
            textAlign={"left"}
            >
              <Text
                fontSize="sm"
                color="#777"
                fontStyle="italic" 
                float="left"
                p="10px"
                pr="30px"
              >
                Developed with ❤️ by the author of&nbsp;
                <Link
                  href="https://devsec-blog.com"
                  color="#fff"
                >
                DevSec Blog
                </Link>

              </Text>
              <Link
                href="https://devsec-blog.com"
              >
                <Image 
                  src={require('./devsec-blog-logo.png')}
                  alt="DevSec Blog Logo"
                  maxH="60px"
                  float={"right"}
                />
              </Link>
          </HStack>
          
        </Flex>
      </Flex>
    );
  }
}

export default App;
