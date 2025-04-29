import { Icon } from '@gravity-ui/uikit'
import { ArrowRight } from '@gravity-ui/icons'
import { CurrencyAssetCard } from '@/shared/ui/CurrencyAsset'
import { ExchangePair } from '@/shared/api/v1/exchangePairsApi'
import { detectAssetForCurrencyAssetCard } from '@/shared/utils/detectAssetForCurrencyAssetCard'

import styles from './styles.module.css'

interface ExchangePairContainerProps {
  exchangePair: ExchangePair
}

export function ExchangePairContainer({
  exchangePair
}: ExchangePairContainerProps) {
  const fromAssetProps = detectAssetForCurrencyAssetCard({
    assetSide: 'from',
    pair: exchangePair
  })
  const toAssetProps = detectAssetForCurrencyAssetCard({
    assetSide: 'to',
    pair: exchangePair
  })

  return (
    <div className={styles['admin-exchange-pair_pair']}>
      {fromAssetProps && <CurrencyAssetCard {...fromAssetProps} />}
      <Icon data={ArrowRight} size={20} className={styles['arrow-color']} />
      {toAssetProps && <CurrencyAssetCard {...toAssetProps} />}
    </div>
  )
}
