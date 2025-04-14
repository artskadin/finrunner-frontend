import { useState } from 'react'
import { Button, Icon, Modal, Text, Tooltip } from '@gravity-ui/uikit'
import { Copy, Pencil, TrashBin } from '@gravity-ui/icons'
import { Route as CurrencyRoute } from '@/routes/admin/currencies'
import { Route as AdminRoute } from '@/routes/admin/route'
import { iaAvailableForAdmin } from '@/shared/utils/checkUserRules'
import { CurrencyForm } from './CurrencyForm'
import { Currency } from '@/shared/api/v1/currency'

import styles from './styles.module.css'
import { DeleteCurrencyForm } from './DeleteCurrencyForm'

export function AdminCurrencyWidget() {
  const currencyRouteData = CurrencyRoute.useLoaderData()
  const adminRouteData = AdminRoute.useLoaderData()

  const [isCreateCurrencyModalOpen, setIsCreateCurrencyModalOpen] =
    useState(false)
  const closeCreateCurrencyModalHandler = () =>
    setIsCreateCurrencyModalOpen(false)

  const [updatingCurrency, setUpdatingCurrency] = useState<Currency | null>(
    null
  )
  const closeUpdateCurrencyModalHandler = () => setUpdatingCurrency(null)

  const [deletingCurrency, setDeletingCurrency] = useState<Currency | null>(
    null
  )
  const closeDeleteCurrencyModalHandler = () => setDeletingCurrency(null)

  if (!currencyRouteData || !adminRouteData) {
    return null
  }

  const { currencies } = currencyRouteData
  const { user } = adminRouteData

  if (!currencies || !user) {
    return null
  }

  const copyCurrencyIdHandelr = (currencyId: string) => {
    navigator.clipboard.writeText(currencyId)
  }

  return (
    <>
      <Modal
        open={isCreateCurrencyModalOpen}
        onClose={closeCreateCurrencyModalHandler}
      >
        <CurrencyForm onCLose={closeCreateCurrencyModalHandler} mode='create' />
      </Modal>

      <Modal
        open={!!updatingCurrency}
        onClose={closeUpdateCurrencyModalHandler}
      >
        {updatingCurrency && (
          <CurrencyForm
            onCLose={closeUpdateCurrencyModalHandler}
            mode='edit'
            initialData={updatingCurrency}
          />
        )}
      </Modal>

      <Modal
        open={!!deletingCurrency}
        onClose={closeDeleteCurrencyModalHandler}
      >
        {deletingCurrency && (
          <DeleteCurrencyForm
            currency={deletingCurrency}
            onClose={closeDeleteCurrencyModalHandler}
          />
        )}
      </Modal>

      <div className={styles.currencies}>
        <div className={styles.currencies_header}>
          <Text variant='subheader-3'>Список валют</Text>
          <Button
            size='m'
            view='flat-action'
            onClick={() => setIsCreateCurrencyModalOpen(true)}
          >
            Добавить
          </Button>
        </div>

        <div className={styles['currencies-list']}>
          {currencies.length === 0 ? (
            <Text
              variant='body-2'
              color='secondary'
              className={styles['currencies-list__emplty']}
            >
              Список валют пуст
            </Text>
          ) : (
            currencies.map((currency) => (
              <div key={currency.id} className={styles.currency}>
                <div className={styles['currency_id-block']}>
                  <Text variant='caption-2' color='secondary'>
                    {currency.id}
                  </Text>
                  <Copy onClick={() => copyCurrencyIdHandelr(currency.id)} />
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
                        onClick={() => setUpdatingCurrency(currency)}
                      >
                        <Icon data={Pencil} size={16} />
                      </Button>
                    </Tooltip>
                    <Tooltip content={'Удалить валюту'} openDelay={200}>
                      <Button
                        size='m'
                        view='flat-danger'
                        disabled={!iaAvailableForAdmin(user.role)}
                        onClick={() => setDeletingCurrency(currency)}
                      >
                        <Icon data={TrashBin} size={16} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
