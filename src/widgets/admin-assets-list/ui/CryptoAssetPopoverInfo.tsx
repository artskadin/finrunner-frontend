import { Text } from '@gravity-ui/uikit'
import { CryptoAsset } from '@/shared/api/v1/cryptoAssetApi'

import styles from './styles.module.css'

export function CryptoAssetPopoverInfo({ asset }: { asset: CryptoAsset }) {
  const {
    id: currencyId,
    fullname,
    shortname,
    createdAt: currencyDate
  } = asset.currency!
  const {
    id: blockchainNetworkId,
    name,
    tokenStandart,
    createdAt: blockchainNetworkDate
  } = asset.blockchainNetwork!

  return (
    <div className={styles['info-popup_container']}>
      <Text color='secondary'>
        ID актива <Text color='primary'>{asset.id}</Text>
      </Text>

      <div className={styles['info-popup_content']}>
        <Text color='info' variant='body-2'>
          Информация о криптовалюте
        </Text>
        <Text color='secondary'>
          ID <Text color='primary'>{currencyId}</Text>
        </Text>
        <Text color='secondary'>
          Full name <Text color='primary'>{fullname}</Text>
        </Text>
        <Text color='secondary'>
          Short name <Text color='primary'>{shortname}</Text>
        </Text>
        <Text color='secondary'>
          Дата создания{' '}
          <Text color='primary'>
            {new Date(currencyDate).toLocaleDateString()}{' '}
            {new Date(currencyDate).toLocaleTimeString()}
          </Text>
        </Text>
      </div>

      <div className={styles['info-popup_content']}>
        <Text color='info' variant='body-2'>
          Информация о блокчейн сети
        </Text>
        <Text color='secondary'>
          ID <Text color='primary'>{blockchainNetworkId}</Text>
        </Text>
        <Text color='secondary'>
          Название сети <Text color='primary'>{name}</Text>
        </Text>
        <Text color='secondary'>
          Стандарт токена <Text color='primary'>{tokenStandart}</Text>
        </Text>
        <Text color='secondary'>
          Дата создания{' '}
          <Text color='primary'>
            {new Date(blockchainNetworkDate).toLocaleDateString()}{' '}
            {new Date(blockchainNetworkDate).toLocaleTimeString()}
          </Text>
        </Text>
      </div>
    </div>
  )
}
