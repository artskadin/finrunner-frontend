import { Loader, Text } from '@gravity-ui/uikit'

import styles from './styles.module.css'

interface BlockLoaderProps {
  text: string
}

export function BlockLoader({ text }: BlockLoaderProps) {
  return (
    <div className={styles.entity_loader}>
      <Loader size='m' />
      <Text variant='body-2' color='brand'>
        {text}
      </Text>
    </div>
  )
}
