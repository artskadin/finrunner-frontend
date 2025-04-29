import { Text } from '@gravity-ui/uikit'
import { BlockchainNetwork } from '@/shared/api/v1/blockchainNetworksApi'

import styles from './styles.module.css'

interface BlockchainNetworkInfoPopoverProps {
  blockchainNework: BlockchainNetwork
}

export function BlockchainNetworkInfoPopover({
  blockchainNework
}: BlockchainNetworkInfoPopoverProps) {
  return (
    <div className={styles['info-popover_content']}>
      <Text color='info' variant='body-2'>
        Информация о блокчейн сети
      </Text>
      <Text color='secondary'>
        ID <Text color='primary'>{blockchainNework.id}</Text>
      </Text>
      <Text color='secondary'>
        Название сети <Text color='primary'>{blockchainNework.name}</Text>
      </Text>
      <Text color='secondary'>
        Стандарт токена{' '}
        <Text color='primary'>{blockchainNework.tokenStandart}</Text>
      </Text>
      <Text color='secondary'>
        Дата создания{' '}
        <Text color='primary'>
          {new Date(blockchainNework.createdAt).toLocaleDateString()}{' '}
          {new Date(blockchainNework.createdAt).toLocaleTimeString()}
        </Text>
      </Text>
    </div>
  )
}
