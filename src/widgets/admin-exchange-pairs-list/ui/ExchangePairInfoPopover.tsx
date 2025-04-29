import { Icon, Text } from '@gravity-ui/uikit'
import { ArrowRight } from '@gravity-ui/icons'
import { ExchangePair } from '@/shared/api/v1/exchangePairsApi'
import { CurrencyInfoPopover } from '@/shared/ui/asset-info-popover-block/CurrencyInfoPopover'
import { BlockchainNetworkInfoPopover } from '@/shared/ui/asset-info-popover-block/BlockchainNetworkInfoPopover'

import styles from './styles.module.css'

interface ExchangePairInfoPopoverProps {
  exchangePair: ExchangePair
}

export function ExchangePairInfoPopover({
  exchangePair
}: ExchangePairInfoPopoverProps) {
  return (
    <div className={styles['exchange-pair-info_popover']}>
      <div className={styles['exchange-pair-info_popover_header']}>
        <Text color='secondary'>
          ID пары <Text color='primary'>{exchangePair.id}</Text>
        </Text>

        <Text color='secondary'>
          Создан{' '}
          <Text color='primary'>
            {new Date(exchangePair.createdAt).toLocaleDateString()}{' '}
            {new Date(exchangePair.createdAt).toLocaleTimeString()}
          </Text>
        </Text>

        <Text color='secondary'>
          Обновлен{' '}
          <Text color='primary'>
            {new Date(exchangePair.updatedAt).toLocaleDateString()}{' '}
            {new Date(exchangePair.updatedAt).toLocaleTimeString()}
          </Text>
        </Text>
      </div>

      <div className={styles['exchange-pair-info_popover_pairs']}>
        <div className={styles['exchange-pair-info_popover_pair-block']}>
          {exchangePair.fromCryptoAsset &&
            exchangePair.fromCryptoAsset.currency && (
              <CurrencyInfoPopover
                currency={exchangePair.fromCryptoAsset.currency}
              />
            )}

          {exchangePair.fromCryptoAsset &&
            exchangePair.fromCryptoAsset.blockchainNetwork && (
              <BlockchainNetworkInfoPopover
                blockchainNework={
                  exchangePair.fromCryptoAsset.blockchainNetwork
                }
              />
            )}

          {/* Добавить в будущем для фиата */}
        </div>

        <Icon data={ArrowRight} size={24} className={styles['arrow-color']} />

        <div className={styles['exchange-pair-info_popover_pair-block']}>
          {exchangePair.toCryptoAsset &&
            exchangePair.toCryptoAsset.currency && (
              <CurrencyInfoPopover
                currency={exchangePair.toCryptoAsset.currency}
              />
            )}

          {exchangePair.toCryptoAsset &&
            exchangePair.toCryptoAsset.blockchainNetwork && (
              <BlockchainNetworkInfoPopover
                blockchainNework={exchangePair.toCryptoAsset.blockchainNetwork}
              />
            )}

          {/* Добавить в будущем для фиата */}
        </div>
      </div>
    </div>
  )
}
