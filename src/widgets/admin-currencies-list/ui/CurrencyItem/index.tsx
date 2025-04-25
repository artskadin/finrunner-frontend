import React from 'react'
import { Button, Icon, Text, Tooltip } from '@gravity-ui/uikit'
import { Copy, Pencil, TrashBin } from '@gravity-ui/icons'
import { User } from '@/shared/api/user'
import { Currency } from '@/shared/api/v1/currencyApi'
import { iaAvailableForAdmin } from '@/shared/utils/checkUserRules'

import styles from './styles.module.css'

interface CurrencyItemProps {
  currency: Currency
  user: User
  onCopy: (id: string) => void
  onEdit: (currency: Currency) => void
  onDelete: (currency: Currency) => void
}

function NonMemoCurrencyItem({
  currency,
  user,
  onCopy,
  onEdit,
  onDelete
}: CurrencyItemProps) {
  return (
    <div className={styles.currency}>
      <div className={styles['currency_id-block']}>
        <Text variant='caption-2' color='secondary'>
          {currency.id}
        </Text>
        <Copy onClick={() => onCopy(currency.id)} />
      </div>

      <div className={styles['currency-data']}>
        <div className={styles['currency-text-block']}>
          <Text color='secondary'>Full name</Text>
          <Text variant='body-2'>{currency.fullname}</Text>
        </div>
        <div className={styles['currency-text-block']}>
          <Text color='secondary'>Short name</Text>
          <Text variant='body-2'>{currency.shortname}</Text>
        </div>
        <div className={styles.currency_actions}>
          <Tooltip content={'Редактировать валюту'} openDelay={200}>
            <Button
              size='m'
              view='flat'
              disabled={!iaAvailableForAdmin(user.role)}
              onClick={() => onEdit(currency)}
            >
              <Icon data={Pencil} size={16} />
            </Button>
          </Tooltip>
          <Tooltip content={'Удалить валюту'} openDelay={200}>
            <Button
              size='m'
              view='flat-danger'
              disabled={!iaAvailableForAdmin(user.role)}
              onClick={() => onDelete(currency)}
            >
              <Icon data={TrashBin} size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export const CurrencyItem = React.memo(NonMemoCurrencyItem)

CurrencyItem.displayName = 'CurrencyItem'
