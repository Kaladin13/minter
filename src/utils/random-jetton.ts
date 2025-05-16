import { faker } from '@faker-js/faker'
import { JettonFormData } from '../types/minter'
import { Buffer } from 'buffer'

const emojis = ['😎', '😂', '🤖', '🐱', '🐶', '🦄', '😐', '😈', '⚡️', '😼']

const generateRandomEmojiImage = () => {
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
  <text x="50%" y="50%" font-size="128" text-anchor="middle" alignment-baseline="middle">${randomEmoji}</text>
  </svg>`

  const base64Image = `data:image/svg+xml;base64,${Buffer.from(svgString, 'utf-8').toString(
    'base64',
  )}`

  return base64Image
}

const makeWordCapital = (str: string) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const generateRandomJettonData = (): JettonFormData => {
  const name = `${makeWordCapital(faker.company.catchPhraseAdjective())} ${makeWordCapital(
    faker.company.buzzNoun(),
  )}`

  const symbol = faker.finance.currencyCode().toUpperCase()

  const description = faker.company.catchPhrase()

  // Generate a random avatar as base64
  const image = generateRandomEmojiImage()

  return {
    name,
    symbol,
    description,
    image,
    decimals: 9, // don't change decimals
  }
}
