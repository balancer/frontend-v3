'use client'

import {
  Text,
  Center,
  Heading,
  Box,
  Button,
  Flex,
  Input,
  Select,
  UnorderedList,
  ListItem,
  Stack,
  Avatar,
  IconButton,
  Card,
  Checkbox,
  Radio,
  RadioGroup,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react'

import { darken } from '@chakra-ui/theme-tools'
import Section from '@/lib/shared/components/layout/Section'

export default function Components() {
  return (
    <Box p="md" maxW="maxContent" mx="auto" mt="xl">
      <Box as="section" mb="24">
        <Heading as="h1" variant="gradient-dusk" size="h1-hero">
          Components
        </Heading>
        <Heading as="h2" size="h4">
          Contents
        </Heading>
        <UnorderedList>
          <ListItem>
            <a href="#colors">Colors</a>
          </ListItem>
          <ListItem>
            <a href="#typography">Typography</a>
          </ListItem>
          <ListItem>
            <a href="#buttons">Buttons</a>
          </ListItem>
          <ListItem>
            <a href="#cards">Cards</a>
          </ListItem>
          <ListItem>
            <a href="#inputs">Inputs</a>
          </ListItem>
        </UnorderedList>
      </Box>

      <Section id="colors">
        <Heading as="h1" variant="gradient-dusk" size="h1-hero">
          Colors
        </Heading>
        <Section variant="subsection">
          <Heading size="h4">Primary</Heading>
          <Stack direction="row">
            <Center bg="primary.50" w="100%" h="16" fontSize="xs" color={'black'}>
              50
            </Center>
            <Center bg="primary.100" w="100%" h="16" fontSize="xs" color={'black'}>
              100
            </Center>
            <Center bg="primary.200" w="100%" h="16" fontSize="xs" color={'black'}>
              200
            </Center>
            <Center bg="primary.300" w="100%" h="16" fontSize="xs" color={'black'}>
              300
            </Center>
            <Center bg="primary.400" w="100%" h="16" fontSize="xs" color={'black'}>
              400
            </Center>
            <Center
              bg="primary.500"
              _hover={{
                bg: darken('primary.500', 10),
              }}
              w="100%"
              h="16"
              fontSize="xs"
              color={'white'}
            >
              500
            </Center>
            <Center bg="primary.600" w="100%" h="16" fontSize="xs" color={'white'}>
              600
            </Center>
            <Center bg="primary.700" w="100%" h="16" fontSize="xs" color={'white'}>
              700
            </Center>
            <Center bg="primary.800" w="100%" h="16" fontSize="xs" color={'white'}>
              800
            </Center>
            <Center bg="primary.900" w="100%" h="16" fontSize="xs" color={'white'}>
              900
            </Center>
          </Stack>
        </Section>
        <Section variant="subsection">
          <Heading size="h4">Sand</Heading>
          <Stack direction="row">
            <Center bg="sand.50" w="100%" h="16" fontSize="xs" color={'black'}>
              50
            </Center>
            <Center bg="sand.100" w="100%" h="16" fontSize="xs" color={'black'}>
              100
            </Center>
            <Center bg="sand.200" w="100%" h="16" fontSize="xs" color={'black'}>
              200
            </Center>
            <Center bg="sand.300" w="100%" h="16" fontSize="xs" color={'black'}>
              300
            </Center>
            <Center bg="sand.400" w="100%" h="16" fontSize="xs" color={'black'}>
              400
            </Center>
            <Center bg="sand.500" w="100%" h="16" fontSize="xs" color={'white'}>
              500
            </Center>
            <Center bg="sand.600" w="100%" h="16" fontSize="xs" color={'white'}>
              600
            </Center>
            <Center bg="sand.700" w="100%" h="16" fontSize="xs" color={'white'}>
              700
            </Center>
            <Center bg="sand.800" w="100%" h="16" fontSize="xs" color={'white'}>
              800
            </Center>
            <Center bg="sand.900" w="100%" h="16" fontSize="xs" color={'white'}>
              900
            </Center>
          </Stack>
        </Section>
        <Section variant="subsection">
          <Heading size="h4">Salmon</Heading>
          <Stack direction="row">
            <Center bg="salmon.50" w="100%" h="16" fontSize="xs" color={'black'}>
              50
            </Center>
            <Center bg="salmon.100" w="100%" h="16" fontSize="xs" color={'black'}>
              100
            </Center>
            <Center bg="salmon.200" w="100%" h="16" fontSize="xs" color={'black'}>
              200
            </Center>
            <Center bg="salmon.300" w="100%" h="16" fontSize="xs" color={'black'}>
              300
            </Center>
            <Center bg="salmon.400" w="100%" h="16" fontSize="xs" color={'black'}>
              400
            </Center>
            <Center bg="salmon.500" w="100%" h="16" fontSize="xs" color={'white'}>
              500
            </Center>
            <Center bg="salmon.600" w="100%" h="16" fontSize="xs" color={'white'}>
              600
            </Center>
            <Center bg="salmon.700" w="100%" h="16" fontSize="xs" color={'white'}>
              700
            </Center>
            <Center bg="salmon.800" w="100%" h="16" fontSize="xs" color={'white'}>
              800
            </Center>
            <Center bg="salmon.900" w="100%" h="16" fontSize="xs" color={'white'}>
              900
            </Center>
          </Stack>
        </Section>
        <Section variant="subsection">
          <Heading size="h4">Lavendar</Heading>
          <Stack direction="row">
            <Center bg="lavender.50" w="100%" h="16" fontSize="xs" color={'black'}>
              50
            </Center>
            <Center bg="lavender.100" w="100%" h="16" fontSize="xs" color={'black'}>
              100
            </Center>
            <Center bg="lavender.200" w="100%" h="16" fontSize="xs" color={'black'}>
              200
            </Center>
            <Center bg="lavender.300" w="100%" h="16" fontSize="xs" color={'black'}>
              300
            </Center>
            <Center bg="lavender.400" w="100%" h="16" fontSize="xs" color={'black'}>
              400
            </Center>
            <Center bg="lavender.500" w="100%" h="16" fontSize="xs" color={'white'}>
              500
            </Center>
            <Center bg="lavender.600" w="100%" h="16" fontSize="xs" color={'white'}>
              600
            </Center>
            <Center bg="lavender.700" w="100%" h="16" fontSize="xs" color={'white'}>
              700
            </Center>
            <Center bg="lavender.800" w="100%" h="16" fontSize="xs" color={'white'}>
              800
            </Center>
            <Center bg="lavender.900" w="100%" h="16" fontSize="xs" color={'white'}>
              900
            </Center>
          </Stack>
        </Section>
        <Section variant="subsection">
          <Heading size="h4">Green</Heading>
          <Stack direction="row">
            <Center bg="green.50" w="100%" h="16" fontSize="xs" color={'black'}>
              50
            </Center>
            <Center bg="green.100" w="100%" h="16" fontSize="xs" color={'black'}>
              100
            </Center>
            <Center bg="green.200" w="100%" h="16" fontSize="xs" color={'black'}>
              200
            </Center>
            <Center bg="green.300" w="100%" h="16" fontSize="xs" color={'black'}>
              300
            </Center>
            <Center bg="green.400" w="100%" h="16" fontSize="xs" color={'black'}>
              400
            </Center>
            <Center bg="green.500" w="100%" h="16" fontSize="xs" color={'white'}>
              500
            </Center>
            <Center bg="green.600" w="100%" h="16" fontSize="xs" color={'white'}>
              600
            </Center>
            <Center bg="green.700" w="100%" h="16" fontSize="xs" color={'white'}>
              700
            </Center>
            <Center bg="green.800" w="100%" h="16" fontSize="xs" color={'white'}>
              800
            </Center>
            <Center bg="green.900" w="100%" h="16" fontSize="xs" color={'white'}>
              900
            </Center>
          </Stack>
        </Section>
        <Section variant="subsection">
          <Heading size="h3">Gradients</Heading>

          <Stack direction="column" spacing="8">
            <Center bgGradient="gradient.dusk" w="100%" h="16">
              Dusk
            </Center>

            <Center bgGradient="gradient.sand" w="100%" h="16">
              Sand
            </Center>
            <Center
              bgGradient="linear(to-tr, red.100 0%, orange.100 50%, yellow.100 100%)"
              w="100%"
              h="16"
            >
              Black
            </Center>
            <Center
              bgGradient="linear(to-tr, red.100 0%, orange.100 50%, yellow.100 100%)"
              w="100%"
              h="16"
            >
              Gray
            </Center>
          </Stack>
        </Section>
      </Section>

      <Section id="typography">
        <Heading as="h1" variant="gradient-dusk" size="h1-hero">
          Typography
        </Heading>

        <Box mb="8">
          <Text variant="eyebrow">H1 Hero</Text>
          <Heading as="h1" variant="h1 " size="h1">
            Hero heading 1
          </Heading>
        </Box>

        <Box mb="8">
          <Text variant="eyebrow">H1</Text>
          <Heading as="h1" variant="sand" size="h1">
            Default app Heading 1
          </Heading>
        </Box>

        <Box mb="8">
          <Text variant="eyebrow">H2</Text>
          <Heading variant="h2" as="h2" size="h2">
            Heading 2
          </Heading>
        </Box>

        <Box mb="8">
          <Text variant="eyebrow">H3</Text>
          <Heading variant="h3" as="h3" size="h3">
            Heading 3
          </Heading>
        </Box>

        <Box mb="8">
          <Text variant="eyebrow">H4</Text>
          <Heading as="h4" size="h4">
            Heading 4
          </Heading>
        </Box>

        <Box mb="8">
          <Text variant="eyebrow">H5</Text>
          <Heading variant="h5" as="h5" size="h5">
            Heading 5
          </Heading>
        </Box>

        <Box mb="8">
          <Text variant="eyebrow">H6</Text>
          <Heading variant="h6" as="h6" size="h6">
            Heading 6
          </Heading>
        </Box>

        <Box mb="8">
          <Text variant="eyebrow">P</Text>
          <Text maxW="container.md">
            Body text lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quidem ipsa
            magnam dignissimos impedit odit tempore, necessitatibus provident cupiditate. Explicabo
            iusto incidunt illum molestiae, dolores quam odit cupiditate id quibusdam!
          </Text>
        </Box>
        <Box mb="8">
          <Text variant="eyebrow">Eyebrow</Text>
          <Text variant="eyebrow">Lorem ipsum</Text>
        </Box>
      </Section>

      <Section id="buttons">
        <Heading as="h1" variant="gradient-dusk" size="h1-hero">
          Buttons
        </Heading>
        <Section variant="subsection">
          <Heading size="h4" as="h2">
            Button sizes
          </Heading>
          <Flex gap="4" align={'center'} wrap="wrap">
            <Button size="xs">xs button</Button>
            <Button size="sm">sm button</Button>
            <Button size="md">md button (default)</Button>
            <Button size="lg">lg button</Button>
          </Flex>
        </Section>
        <Section variant="subsection">
          <Heading size="h4" as="h2">
            Button variants
          </Heading>
          <Flex gap="4" align={'center'} wrap="wrap">
            <Button variant="solid">Solid button (default)</Button>
            <Button variant="outline">Outline button</Button>
            <Button variant="ghost">Ghost button</Button>
            <Button variant="link">Link button</Button>
          </Flex>
        </Section>
        <Section variant="subsection">
          <Heading size="h4" as="h2">
            Custom{' '}
          </Heading>
          <Flex gap="3" align={'center'} wrap="wrap">
            <Button variant="dusk" minW="160px">
              Dusk
            </Button>
            <Button variant="sand" minW="160px">
              Gold
            </Button>
          </Flex>
        </Section>
      </Section>

      <Section id="cards">
        <Heading as="h1" variant="gradient-dusk" size="h1-hero">
          Cards
        </Heading>
        <Card maxW="md">
          <CardHeader>
            <Flex>
              <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />

                <Box>
                  <Heading size="sm">Title</Heading>
                  <Text>Subtitle</Text>
                </Box>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text>
              lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora quidem ipsa magnam
              dignissimos impedit odit tempore, necessitatibus provident cupiditate. Explicabo iusto
              incidunt illum molestiae, dolores quam odit cupiditate id quibusdam!
            </Text>
          </CardBody>
          <Image
            objectFit="cover"
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt="Chakra UI"
          />

          <CardFooter
            justify="space-between"
            flexWrap="wrap"
            sx={{
              '& > button': {
                minW: '136px',
              },
            }}
          >
            <Button flex="1" variant="ghost">
              Like
            </Button>
            <Button flex="1" variant="ghost">
              Comment
            </Button>
            <Button flex="1" variant="ghost">
              Share
            </Button>
          </CardFooter>
        </Card>
      </Section>

      <Section id="inputs" maxW="375px">

        <Heading as="h1" variant="gradient-dusk" size="h1-hero">
          Inputs
        </Heading>


        <Box mb="8">
          <Text variant="eyebrow" mb="4">
            Input
          </Text>
          <Input placeholder="Placeholder text" />
        </Box>

        <Box mb="8">
          <Text variant="eyebrow" mb="4">
            Select
          </Text>
          <Select placeholder="Select option">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>
        </Box>

        <Box mb="8">
          <Text variant="eyebrow" mb="4">
            Checkbox
          </Text>
          <Checkbox defaultChecked>Checkbox</Checkbox>
        </Box>

        <Box mb="8">
          <Text variant="eyebrow" mb="4">
            Radios
          </Text>
          <RadioGroup defaultValue="1">
            <Stack>
              <Radio value="1" isDisabled>
                Checked
              </Radio>
              <Radio value="2">Unchecked</Radio>
              <Radio value="3">Unchecked</Radio>
            </Stack>
          </RadioGroup>
        </Box>

        <Box mb="8">
          <Text variant="eyebrow" mb="4">
            Slider
          </Text>
          <Slider aria-label="slider-ex-1" defaultValue={30}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
      </Section>
    </Box>
  )
}
