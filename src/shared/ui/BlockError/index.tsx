import { Button, Text } from '@gravity-ui/uikit'

import styles from './styles.module.css'

interface BlockErrorProps {
  text: string
  refetch: () => void
}

export function BlockError({ text, refetch }: BlockErrorProps) {
  return (
    <div className={styles.entity_error}>
      <Text variant='body-2' color='secondary'>
        {text}
      </Text>
      <Button view='flat-action' onClick={refetch}>
        Загрузить еще раз
      </Button>
    </div>
  )
}
