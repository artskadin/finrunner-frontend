export function Toaster({ isShown }: { isShown: boolean }) {
  if (isShown) {
    return <div>toaster</div>
  }

  return null
}
