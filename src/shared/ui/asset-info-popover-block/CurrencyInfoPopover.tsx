import { Text } from '@gravity-ui/uikit'
import { Currency } from '@/shared/api/v1/currencyApi'

import styles from './styles.module.css'

interface CurrencyInfoPopoverProps {
  currency: Currency
}

export function CurrencyInfoPopover({ currency }: CurrencyInfoPopoverProps) {
  return (
    <div className={styles['info-popover_content']}>
      <Text color='info' variant='body-2'>
        Информация о криптовалюте
      </Text>
      <Text color='secondary'>
        ID <Text color='primary'>{currency.id}</Text>
      </Text>
      <Text color='secondary'>
        Full name <Text color='primary'>{currency.fullname}</Text>
      </Text>
      <Text color='secondary'>
        Short name <Text color='primary'>{currency.shortname}</Text>
      </Text>
      <Text color='secondary'>
        Дата создания{' '}
        <Text color='primary'>
          {new Date(currency.createdAt).toLocaleDateString()}{' '}
          {new Date(currency.createdAt).toLocaleTimeString()}
        </Text>
      </Text>
    </div>
  )
}
