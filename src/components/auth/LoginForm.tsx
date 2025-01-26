import AuthCard from "@/components/auth/AuthCard";
export const LoginForm = () => {
  return (
    <AuthCard
      cardTile={'Welcome to blogs'}
      backButtonHref={'/auth/register'}
      backButtonLable={'create a new account'}
      showSocials = {true}
    >
    <div>
      form zhu
    </div>
    </AuthCard>
  )
}
