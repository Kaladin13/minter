import { Flex } from '@chakra-ui/react'
import { FC } from 'react'

const Footer: FC = () => {
  return (
    <Flex
      as={'footer'}
      height={20}
    >
      <p>Footer</p>
    </Flex>
  )
}

export { Footer }
