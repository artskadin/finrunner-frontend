import { Text } from '@gravity-ui/uikit'
import { CryptoAsset } from '@/shared/api/v1/cryptoAssetApi'
import { CurrencyInfoPopover } from '@/shared/ui/asset-info-popover-block/CurrencyInfoPopover'
import { BlockchainNetworkInfoPopover } from '@/shared/ui/asset-info-popover-block/BlockchainNetworkInfoPopover'

import styles from './styles.module.css'

export function CryptoAssetPopoverInfo({ asset }: { asset: CryptoAsset }) {
  return (
    <div className={styles['info-popup_container']}>
      <div className={styles['info-popup_header']}>
        <Text color='secondary'>
          ID актива <Text color='primary'>{asset.id}</Text>
        </Text>

        <Text color='secondary'>
          Создан{' '}
          <Text color='primary'>
            {new Date(asset.createdAt).toLocaleDateString()}{' '}
            {new Date(asset.createdAt).toLocaleTimeString()}
          </Text>
        </Text>
      </div>

      {asset.currency && <CurrencyInfoPopover currency={asset.currency} />}

      {asset.blockchainNetwork && (
        <BlockchainNetworkInfoPopover
          blockchainNework={asset.blockchainNetwork}
        />
      )}
    </div>
  )
}
