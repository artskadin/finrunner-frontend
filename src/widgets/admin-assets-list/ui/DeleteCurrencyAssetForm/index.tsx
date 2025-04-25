import { AxiosError } from 'axios'
import { useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Button, Text } from '@gravity-ui/uikit'
import { queryClient } from '@/app/main'
import {
  CurrencyAssetCard,
  CurrencyAssetCardProps
} from '@/shared/ui/CurrencyAsset'
import {
  deleteCryptoAssetApi,
  DeleteCryptoAssetPayload,
  DeleteCryptoAssetSuccessResponse
} from '@/shared/api/v1/cryptoAssetApi'

import styles from './styles.module.css'

interface DeleteCurrencyAssetFormProps {
  onClose: () => void
  currencyAsset: CurrencyAssetCardProps
}

export function DeleteCurrencyAssetForm({
  currencyAsset,
  onClose
}: DeleteCurrencyAssetFormProps) {
  const router = useRouter()
  const { assetType, asset } = currencyAsset

  const { mutate: deleteCryptoAsset, isPending: isDeletingCryptoAsset } =
    useMutation<
      DeleteCryptoAssetSuccessResponse,
      AxiosError,
      DeleteCryptoAssetPayload
    >({
      mutationFn: deleteCryptoAssetApi,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['admin', 'cryptoAssets', 'getAll']
        })

        router.invalidate().then(() => onClose())
      },
      onError: () => {
        router.invalidate().then(() => onClose())
      }
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    deleteCryptoAsset({ id: asset.id })
  }

  return (
    <div className={styles['delete-currency-asset-container']}>
      <div className={styles['delete-currency-asset-header']}>
        <Text variant='header-1'>
          Вы уверены, что хотите удалить этот валютный актив?
        </Text>

        {assetType === 'crypto' && (
          <CurrencyAssetCard assetType={assetType} asset={asset} />
        )}

        {assetType === 'fiat' && (
          <CurrencyAssetCard assetType={assetType} asset={asset} />
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles['delete-currency-asset-actions']}>
          <Button
            type='submit'
            size='l'
            view='outlined-danger'
            disabled={isDeletingCryptoAsset}
          >
            Удалить
          </Button>
          <Button
            size='l'
            view='flat-secondary'
            onClick={onClose}
            disabled={isDeletingCryptoAsset}
          >
            Отменить
          </Button>
        </div>
      </form>
    </div>
  )
}
