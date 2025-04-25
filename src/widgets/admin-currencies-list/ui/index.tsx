import { useCallback, useState } from 'react'
import { Button, Modal, Text } from '@gravity-ui/uikit'
import { Route as CurrencyRoute } from '@/routes/admin/currencies'
import { Route as AdminRoute } from '@/routes/admin/route'
import { CurrencyForm } from './CurrencyForm'
import { Currency } from '@/shared/api/v1/currencyApi'
import { CurrencyEntityList } from '@/shared/ui/CurrencyEntityList'
import { DeleteCurrencyForm } from './DeleteCurrencyForm'
import { CurrencyItem } from './CurrencyItem'

import styles from './styles.module.css'

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

  const copyCurrencyIdHandler = useCallback((currencyId: string) => {
    navigator.clipboard.writeText(currencyId)
  }, [])

  if (!currencyRouteData || !adminRouteData) {
    return null
  }

  const { currencies } = currencyRouteData
  const { user } = adminRouteData

  if (!currencies || !user) {
    return null
  }

  const handleAddCurrencyClick = useCallback(
    () => setIsCreateCurrencyModalOpen(true),
    []
  )
  const handleEditCurrencyClick = useCallback(
    (currency: Currency) => setUpdatingCurrency(currency),
    []
  )
  const handleDeleteCurrencyClick = useCallback(
    (currency: Currency) => setDeletingCurrency(currency),
    []
  )

  const renderHeader = useCallback(
    ({ totalCount }: { totalCount: number }) => (
      <div className={styles.currencies_header}>
        <Text variant='subheader-3'>
          Список валют{' '}
          <Text variant='subheader-3' color='secondary'>
            ({totalCount})
          </Text>
        </Text>

        <Button size='m' view='flat-action' onClick={handleAddCurrencyClick}>
          Добавить
        </Button>
      </div>
    ),
    [handleAddCurrencyClick]
  )

  const renderItem = useCallback(
    (currency: Currency) => (
      <CurrencyItem
        currency={currency}
        user={user}
        onCopy={copyCurrencyIdHandler}
        onEdit={handleEditCurrencyClick}
        onDelete={handleDeleteCurrencyClick}
      />
    ),
    [copyCurrencyIdHandler, handleEditCurrencyClick, handleDeleteCurrencyClick]
  )

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

      <CurrencyEntityList<Currency, { totalCount: number }>
        items={currencies}
        getItemId={(item) => item.id}
        renderHeader={() => renderHeader({ totalCount: currencies.length })}
        renderItem={renderItem}
        emptyPlaceholder={
          <Text variant='body-2' color='secondary'>
            Список валют пуст
          </Text>
        }
      />
    </>
  )
}
