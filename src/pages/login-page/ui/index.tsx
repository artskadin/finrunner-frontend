import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Button, Label, Link, Text, TextInput } from '@gravity-ui/uikit'
import { useAuthStore } from '@/entities/user/model/authStore'
import { authorizeApi, requestOtpApi } from '@/shared/api/auth'

import styles from './styles.module.css'
import { getMeApi } from '@/shared/api/user'

const OTP_RESEND_TIMEOUT = 60
const OTP_LENGTH = 6

export function LoginPage() {
  const navigate = useNavigate()
  const setAuthState = useAuthStore((state) => state.actions.setAuthState)
  const [telegramUsername, setTelegramUsername] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'username' | 'otp'>('username')

  const [hasTgNameError, setHasTgNameError] = useState(false)
  const [hasOtpError, setHasOtpError] = useState(false)

  const [resendTimer, setResendTimer] = useState(0)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { redirect: redirectUrl } = useSearch({ from: '/(auth)/login' })

  const startResendTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    setResendTimer(OTP_RESEND_TIMEOUT)

    timerIntervalRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!)
          return 0
        }

        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  const { mutate: requestOtp, isPending: isRequestingOtp } = useMutation({
    mutationFn: requestOtpApi,
    onSuccess: () => {
      setHasTgNameError(false)
      setStep('otp')
      startResendTimer()
    },
    onError: () => {
      setHasTgNameError(true)
    }
  })

  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useMutation({
    mutationFn: authorizeApi,
    onSuccess: async (data) => {
      setHasOtpError(false)

      if (data.accessToken) {
        setAuthState({ accessToken: data.accessToken })

        try {
          const userData = await getMeApi()

          setAuthState({ user: userData })

          const redirectTo = redirectUrl || '/exchange'
          navigate({ to: redirectTo, replace: true })
        } catch (err) {
          useAuthStore.getState().actions.logout({ redirect: false })
        }
      } else {
        setHasOtpError(true)
        setOtp('')
      }
    },
    onError: () => {
      setHasOtpError(true)
      setOtp('')
    }
  })

  const handleRequestOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedUsername = telegramUsername.trim()

    if (!trimmedUsername || isRequestingOtp) return

    requestOtp({ telegramUsername: trimmedUsername })
  }

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedUsername = telegramUsername.trim()
    const trimmedOtp = otp.trim()

    if (!trimmedOtp || isVerifyingOtp) return

    verifyOtp({
      telegramUsername: trimmedUsername,
      otpCode: trimmedOtp
    })
  }

  const handleBackToUsername = () => {
    setStep('username')
    setHasTgNameError(false)
    setHasOtpError(false)
    setOtp('')

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }
    setResendTimer(0)
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (value.length <= OTP_LENGTH) {
      setOtp(value)
    }
  }

  useEffect(() => {
    if (step === 'otp' && otp.trim().length === OTP_LENGTH && !isVerifyingOtp) {
      verifyOtp({
        telegramUsername: telegramUsername.trim(),
        otpCode: otp.trim()
      })
    }
  }, [otp, step, telegramUsername, isVerifyingOtp, verifyOtp])

  return (
    <div className={styles['login-form-container']}>
      <Text variant='display-1'>Вход</Text>
      <form onSubmit={handleRequestOtpSubmit}>
        <div className={styles['login-form-container_block']}>
          <Text variant='body-2'>
            Укажите ник в телеграме и мы отправим код подтверждения
          </Text>
          <TextInput
            placeholder='Ваш telegram username'
            size='l'
            autoComplete
            value={telegramUsername}
            onChange={(e) => {
              setHasTgNameError(false)

              const nickname = e.target.value

              nickname.startsWith('@')
                ? setTelegramUsername(nickname.substring(1))
                : setTelegramUsername(nickname)
            }}
            disabled={isRequestingOtp || step === 'otp'}
            validationState={hasTgNameError ? 'invalid' : undefined}
            autoFocus
            hasClear
          />

          {hasTgNameError && (
            <div className={styles['tg-name-error']}>
              <Text variant='body-2' color='danger'>
                Не нашли пользователя с именем <i>{telegramUsername.trim()}</i>.
                Проверьте написание или{' '}
                <Link
                  href={import.meta.env.VITE_TG_BOT_REGISTER_LINK}
                  underline
                  className={styles['login-form_link-color']}
                  target='_blank'
                >
                  зарегистрируйтесь через телеграм.
                </Link>
              </Text>
              <Text variant='body-2' color='danger'>
                Если вы меняли свой <i>Username</i> – просто перезапустите бота
                через <Label theme='danger'>/start</Label>
              </Text>
            </div>
          )}

          {step === 'username' && (
            <Button
              type={'submit'}
              view='action'
              size='l'
              loading={isRequestingOtp}
              disabled={
                isRequestingOtp || !telegramUsername.trim() || hasTgNameError
              }
            >
              Получить код
            </Button>
          )}

          {step === 'otp' && (
            <Button
              className={styles['login-form-second-action-btn']}
              type='button'
              view='flat'
              size='s'
              onClick={handleBackToUsername}
              disabled={isVerifyingOtp || isRequestingOtp}
            >
              Изменить телеграм
            </Button>
          )}
        </div>
      </form>

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtpSubmit}>
          <div className={styles['login-form-container_block']}>
            <Text variant='body-2'>Введите код</Text>
            <TextInput
              size='l'
              placeholder='Код для входа'
              type='number'
              value={otp}
              onChange={handleOtpChange}
              disabled={isVerifyingOtp}
              autoFocus
              hasClear
              validationState={hasOtpError ? 'invalid' : undefined}
            />

            {hasOtpError && (
              <Text variant='body-2' color='danger'>
                Неверный код
              </Text>
            )}

            {resendTimer > 0 ? (
              <Text variant='body-1' color='secondary'>
                Повторная отправка через {resendTimer} сек
              </Text>
            ) : (
              <Button
                className={styles['login-form-second-action-btn']}
                type={'button'}
                view='flat'
                size='s'
                onClick={handleRequestOtpSubmit}
                loading={isRequestingOtp}
                disabled={isRequestingOtp || resendTimer > 0}
              >
                Получить код еще раз
              </Button>
            )}
          </div>
        </form>
      )}

      <div className={styles['login-form_footer']}>
        <Button
          type='button'
          view='flat-action'
          size='l'
          className={styles['login-form_footer_register-btn']}
          onClick={handleBackToUsername}
          rel='noopener noreferrer'
          target='_blank'
          href={import.meta.env.VITE_TG_BOT_REGISTER_LINK}
        >
          Зарегистрироваться через Telegram
        </Button>
      </div>
    </div>
  )
}
