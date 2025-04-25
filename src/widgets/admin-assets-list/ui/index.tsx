import { useCallback, useState } from 'react'
import { Button, Modal, SegmentedRadioGroup, Text } from '@gravity-ui/uikit'
import { Route as CurrencyRoute } from '@/routes/admin/currencies'
import { Route as AdminRoute } from '@/routes/admin/route'
import {
  CurrencyAssetCard,
  CurrencyAssetCardProps
} from '@/shared/ui/CurrencyAsset'
import { CurrencyAssetWrapper } from './CurrencyAssetWrapper'
import { CurrencyAssetForm } from './CurrencyAssetForm'
import { DeleteCurrencyAssetForm } from './DeleteCurrencyAssetForm'

import styles from './styles.module.css'

export function AdminAssetsWidget() {
  const currencyRouteData = CurrencyRoute.useLoaderData()
  const adminRouteData = AdminRoute.useLoaderData()

  if (!currencyRouteData || !adminRouteData) {
    return null
  }

  const { cryptoAssets } = currencyRouteData

  if (!cryptoAssets) {
    return null
  }

  const [
    isCreatingCurrencyAssetModalOpen,
    setIsCreatingCurrencyAssetModalOpen
  ] = useState(false)

  const closeCreateCurrencyAssetModalHandler = () =>
    setIsCreatingCurrencyAssetModalOpen(false)
  const openCreateCurrencyAssetModalHandler = () =>
    setIsCreatingCurrencyAssetModalOpen(true)

  const [deletingCurrencyAsset, setDeletingCurrencyAsset] =
    useState<CurrencyAssetCardProps | null>(null)
  const closeDeleteCurrencyAssetModalHandler = () =>
    setDeletingCurrencyAsset(null)
  const deleteCurrencyAssetFormHandler = useCallback(
    (currencyAsset: CurrencyAssetCardProps) => {
      setDeletingCurrencyAsset(currencyAsset)
    },
    [setDeletingCurrencyAsset]
  )

  return (
    <div className={styles['admin-assets_container']}>
      <div className={styles['admin-assets_header']}>
        <div className={styles['admin-assets_header__title']}>
          <Text variant='subheader-3'>
            Список валютных активов{' '}
            <Text variant='subheader-3' color='secondary'>
              ({cryptoAssets.length})
            </Text>
          </Text>

          <Button
            size='m'
            view='flat-action'
            onClick={openCreateCurrencyAssetModalHandler}
          >
            Добавить
          </Button>
        </div>

        <SegmentedRadioGroup size='l' defaultValue='all'>
          <SegmentedRadioGroup.Option value='all'>
            Все активы
          </SegmentedRadioGroup.Option>
          <SegmentedRadioGroup.Option value='crypto'>
            Криптоактивы
          </SegmentedRadioGroup.Option>
          <SegmentedRadioGroup.Option value='fiat'>
            Фиантные активы
          </SegmentedRadioGroup.Option>
        </SegmentedRadioGroup>
      </div>

      <div className={styles['admin-assets_content']}>
        {cryptoAssets.map((asset) => (
          <CurrencyAssetWrapper
            key={asset.id}
            assetData={{ assetType: 'crypto', asset }}
            onEdit={() => {}}
            onDelete={deleteCurrencyAssetFormHandler}
          >
            <CurrencyAssetCard assetType='crypto' asset={asset} />
          </CurrencyAssetWrapper>
        ))}

        {cryptoAssets.length === 0 && (
          <div className={styles['admin-assets_list__empty']}>
            <Text variant='body-2' color='secondary'>
              Список валютных активов пуст
            </Text>
          </div>
        )}
      </div>

      <Modal
        open={isCreatingCurrencyAssetModalOpen}
        onClose={closeCreateCurrencyAssetModalHandler}
      >
        <CurrencyAssetForm onClose={closeCreateCurrencyAssetModalHandler} />
      </Modal>

      <Modal
        open={!!deletingCurrencyAsset}
        onClose={closeDeleteCurrencyAssetModalHandler}
      >
        {deletingCurrencyAsset && (
          <DeleteCurrencyAssetForm
            currencyAsset={deletingCurrencyAsset}
            onClose={closeDeleteCurrencyAssetModalHandler}
          />
        )}
      </Modal>
    </div>
  )
}
