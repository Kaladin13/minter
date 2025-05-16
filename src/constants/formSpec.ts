import { FormField } from '../types/minter'

export const jettonFormSpec: FormField[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    description: 'Token name',
    default: 'Tact Jetton',
  },
  {
    name: 'symbol',
    label: 'Symbol',
    type: 'text',
    required: true,
    description: 'Token symbol',
    default: 'SYMBOL',
  },
  {
    name: 'decimals',
    label: 'Decimals',
    type: 'number',
    required: true,
    description: 'Token decimals',
    default: '9',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: false,
    description: 'Token description',
  },
  {
    name: 'image',
    label: 'Token Image',
    type: 'url',
    required: false,
    description: 'Token logo URL',
  },
]
