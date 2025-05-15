import { Sha256 } from '@aws-crypto/sha256-js'
import { Buffer } from 'buffer'
import { Cell, Dictionary, beginCell } from '@ton/ton'
import { JettonFormData } from '@/types/minter'

const ONCHAIN_CONTENT_PREFIX = 0x00
const SNAKE_PREFIX = 0x00
const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8)

const sha256 = (str: string) => {
  const sha = new Sha256()
  sha.update(str)
  return Buffer.from(sha.digestSync())
}

const toKey = (key: string) => {
  return BigInt(`0x${sha256(key).toString('hex')}`)
}

const transformToStrings = (
  obj: Record<string, number | string | undefined>,
): Record<string, string> => {
  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key]
    if (val === undefined) {
      return acc
    }
    acc[key] = String(obj[key])
    return acc
  }, {} as Record<string, string>)
}

export function buildOnchainMetadata(data: JettonFormData): Cell {
  const dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell())
  const strData = transformToStrings(data)

  // Store the on-chain metadata in the dictionary
  Object.entries(strData).forEach(([key, value]) => {
    dict.set(toKey(key), makeSnakeCell(Buffer.from(value, 'utf8')))
  })

  return beginCell().storeInt(ONCHAIN_CONTENT_PREFIX, 8).storeDict(dict).endCell()
}

function makeSnakeCell(data: Buffer) {
  // Create a cell that package the data
  const chunks = bufferToChunks(data, CELL_MAX_SIZE_BYTES)

  const b = chunks.reduceRight((curCell, chunk, index) => {
    if (index === 0) {
      curCell.storeInt(SNAKE_PREFIX, 8)
    }
    curCell.storeBuffer(chunk)
    if (index > 0) {
      const cell = curCell.endCell()
      return beginCell().storeRef(cell)
    } else {
      return curCell
    }
  }, beginCell())
  return b.endCell()
}

function bufferToChunks(buff: Buffer, chunkSize: number) {
  const chunks: Buffer[] = []
  while (buff.byteLength > 0) {
    chunks.push(buff.slice(0, chunkSize))
    buff = buff.slice(chunkSize)
  }
  return chunks
}
