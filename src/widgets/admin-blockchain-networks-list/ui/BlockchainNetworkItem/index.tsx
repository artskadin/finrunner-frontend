import React from 'react'
import { Button, Icon, Text, Tooltip } from '@gravity-ui/uikit'
import { Copy, Pencil, TrashBin } from '@gravity-ui/icons'
import { User } from '@/shared/api/user'
import { BlockchainNetwork } from '@/shared/api/v1/blockchainNetworksApi'
import { isAvailableForAdmin } from '@/shared/utils/checkUserRules'

import styles from './styles.module.css'

interface BlockchainNetworkItemProps {
  blockchainNetwork: BlockchainNetwork
  user: User
  onCopy: (id: string) => void
  onEdit: (blockchainNetwork: BlockchainNetwork) => void
  onDelete: (blockchainNetwork: BlockchainNetwork) => void
}

function NonMemoBlockchainNetworkItem({
  blockchainNetwork,
  user,
  onCopy,
  onEdit,
  onDelete
}: BlockchainNetworkItemProps) {
  return (
    <div className={styles['blockchain-network']}>
      <div className={styles['blockchain-network_id-block']}>
        <Text variant='caption-2' color='secondary'>
          {blockchainNetwork.id}
        </Text>
        <Copy onClick={() => onCopy(blockchainNetwork.id)} />
      </div>

      <div className={styles['blockchain-network-data']}>
        <div className={styles['blockchain-network-text-block']}>
          <Text color='secondary'>Название сети</Text>
          <Text variant='body-2'>{blockchainNetwork.name}</Text>
        </div>
        <div className={styles['blockchain-network-text-block']}>
          <Text color='secondary'>Стандарт токена</Text>
          <Text variant='body-2'>{blockchainNetwork.tokenStandart}</Text>
        </div>
        <div className={styles['blockchain-network_actions']}>
          <Tooltip content={'Редактировать блокчейн сеть'} openDelay={200}>
            <Button
              size='m'
              view='flat'
              disabled={!isAvailableForAdmin(user.role)}
              onClick={() => onEdit(blockchainNetwork)}
            >
              <Icon data={Pencil} size={16} />
            </Button>
          </Tooltip>
          <Tooltip content={'Удалить блокчейн сеть'} openDelay={200}>
            <Button
              size='m'
              view='flat-danger'
              disabled={!isAvailableForAdmin(user.role)}
              onClick={() => onDelete(blockchainNetwork)}
            >
              <Icon data={TrashBin} size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export const BlockchainNetworkItem = React.memo(NonMemoBlockchainNetworkItem)

BlockchainNetworkItem.displayName = 'BlockchainNetworkItem'
