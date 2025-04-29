import { useCallback, useState } from 'react'
import { Button, Modal, SegmentedRadioGroup, Text } from '@gravity-ui/uikit'
import { Route as AdminRoute } from '@/routes/admin/route'
import {
  CurrencyAssetCard,
  CurrencyAssetCardProps
} from '@/shared/ui/CurrencyAsset'
import { CurrencyAssetWrapper } from './CurrencyAssetWrapper'
import { CurrencyAssetForm } from './CurrencyAssetForm'
import { DeleteCurrencyAssetForm } from './DeleteCurrencyAssetForm'
import { BlockLoader } from '@/shared/ui/BlockLoader'
import { BlockError } from '@/shared/ui/BlockError'
import { isAvailableForAdmin } from '@/shared/utils/checkUserRules'
import { useCryptoAssetsQuery } from '../queries'

import styles from './styles.module.css'

export function AdminAssetsWidget() {
  const adminRouteData = AdminRoute.useLoaderData()

  const {
    data: cryptoAssets,
    isLoading,
    isError,
    refetch
  } = useCryptoAssetsQuery()

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

  if (!adminRouteData) {
    return null
  }

  const { user } = adminRouteData

  if (!user) {
    return null
  }

  return (
    <div className={styles['admin-assets_container']}>
      <div className={styles['admin-assets_header']}>
        <div className={styles['admin-assets_header__title']}>
          <Text variant='subheader-3'>
            Список валютных активов{' '}
            <Text variant='subheader-3' color='secondary'>
              ({cryptoAssets?.length || 0})
            </Text>
          </Text>

          <Button
            size='m'
            view='flat-action'
            onClick={openCreateCurrencyAssetModalHandler}
            disabled={isLoading || !isAvailableForAdmin(user.role)}
          >
            Добавить
          </Button>
        </div>

        <SegmentedRadioGroup size='m' defaultValue='all'>
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

      {isLoading && <BlockLoader text='Загрузка валютный активов' />}

      {isError && <BlockError text='Не удалось загрузить' refetch={refetch} />}

      {cryptoAssets && (
        <div className={styles['admin-assets_content']}>
          {cryptoAssets.map((asset) => (
            <CurrencyAssetWrapper
              key={asset.id}
              assetData={{ assetType: 'crypto', asset }}
              user={user}
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
      )}

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
