import {
  Badge,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  Text,
  PopoverTrigger,
  VStack,
  Image,
  Button,
} from '@chakra-ui/react'
import { PoolCategory } from './getPoolCategories'
import { usePool } from '../PoolProvider'
import { usePoolCategories } from './PoolCategoriesProvider'
import Link from 'next/link'

function PoolCategoryBadge({ category }: { category: PoolCategory }) {
  const { getCategoryIconSrc } = usePoolCategories()
  const categoryIconSrc = getCategoryIconSrc(category)

  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <HStack>
          {categoryIconSrc && (
            <Badge
              display="flex"
              alignItems="center"
              bg="background.level2"
              borderRadius="full"
              borderWidth={1}
              borderColor="border.base"
              shadow="sm"
              textTransform="none"
              p="xs"
              zIndex={2}
            >
              <Image src={categoryIconSrc} alt={category.name} w={6} h={6} />
            </Badge>
          )}
          <Badge
            display="flex"
            alignItems="center"
            bg="background.level2"
            borderRadius="full"
            borderWidth={1}
            borderColor="border.base"
            shadow="sm"
            textTransform="none"
            p="xs"
            pl={categoryIconSrc ? 8 : undefined}
            ml={categoryIconSrc ? -9 : 0}
            minH="34px"
          >
            {category.iconUrl ? (
              <Image src={category.iconUrl} alt={category.name} w={6} h={6} rounded="full" />
            ) : (
              <Text fontWeight="medium">{category.name}</Text>
            )}
          </Badge>
        </HStack>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow bg="background.level3" />
        <PopoverCloseButton />
        <PopoverBody>
          <VStack spacing="md" align="start">
            <VStack spacing="xs" align="start">
              <Text fontSize="lg" fontWeight="bold">
                {category.name}
              </Text>
              {category.url && (
                <Text color="grayText" fontSize="sm">
                  {category.url}
                </Text>
              )}
            </VStack>
            <Text>{category.description}</Text>
            {category.url && (
              <Button
                as={Link}
                href={category.url}
                variant="secondary"
                w="full"
                size="sm"
                target="_blank"
                rel="noreferrer"
              >
                Learn more
              </Button>
            )}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export function PoolCategories() {
  const { pool } = usePool()
  const { getPoolCategories } = usePoolCategories()

  const poolCategories = getPoolCategories(pool)

  return (
    <HStack>
      {poolCategories.map(category => (
        <PoolCategoryBadge key={category.id} category={category} />
      ))}
    </HStack>
  )
}
