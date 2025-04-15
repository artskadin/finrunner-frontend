import { AxiosError } from 'axios'
import { useRouter } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import {
  BlockchainNetwork,
  deleteBlockchainNetworkApi,
  DeleteBlockchainNetworkParams,
  DeleteBlockchainNetworkSuccessResponse
} from '@/shared/api/v1/blockchainNetworks'

import styles from './styles.module.css'
import { queryClient } from '@/app/main'
import { Button, Text } from '@gravity-ui/uikit'

interface DeleteBlockchainMetworkFormProps {
  onClose: () => void
  blockchainNetwork: BlockchainNetwork
}

export function DeleteBlockchainMetworkForm({
  blockchainNetwork,
  onClose
}: DeleteBlockchainMetworkFormProps) {
  const router = useRouter()

  const { mutate: deleteBlockchainNetwork, isPending: isDeleting } =
    useMutation<
      DeleteBlockchainNetworkSuccessResponse,
      AxiosError,
      DeleteBlockchainNetworkParams
    >({
      mutationFn: deleteBlockchainNetworkApi,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['admin', 'blockchainNetworks', 'getAll']
        })

        router.invalidate().then(() => {
          onClose()
        })
      },
      onError: () => {
        router.invalidate().then(() => {
          // Выводить ошибку, если будет мешать!
          onClose()
        })
      }
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    deleteBlockchainNetwork({ id: blockchainNetwork.id })
  }

  return (
    <div className={styles['delete-blockchain-network-container']}>
      <div className={styles['delete-blockchain-network-header']}>
        <Text variant='header-1'>Вы уверены, что хотите удалить</Text>
        <Text variant='header-1' color='info'>
          {blockchainNetwork.name} – {blockchainNetwork.tokenStandart}?
        </Text>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles['delete-blockchain-network-actions']}>
          <Button
            type='submit'
            size='l'
            view='outlined-danger'
            disabled={isDeleting}
          >
            Удалить
          </Button>
          <Button
            size='l'
            view='flat-secondary'
            disabled={isDeleting}
            onClick={onClose}
          >
            Отменить
          </Button>
        </div>
      </form>
    </div>
  )
}
