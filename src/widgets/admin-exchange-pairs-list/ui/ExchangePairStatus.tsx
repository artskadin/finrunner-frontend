import { Label } from '@gravity-ui/uikit'
import { ExchangePair } from '@/shared/api/v1/exchangePairsApi'

export function ExchangePairStatus({
  status
}: {
  status: ExchangePair['status']
}) {
  let label

  switch (status) {
    case 'ACTIVE': {
      label = (
        <Label theme='success' size='s' onClick={() => {}}>
          Включена
        </Label>
      )
      break
    }

    case 'INACTIVE': {
      label = (
        <Label theme='danger' size='s' onClick={() => {}}>
          Отключена
        </Label>
      )
      break
    }

    case 'ARCHIVED': {
      label = (
        <Label theme='unknown' size='s' onClick={() => {}}>
          В архиве
        </Label>
      )
      break
    }
  }

  return label
}
