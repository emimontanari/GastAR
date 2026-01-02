import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">G</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Gasti</span>
            </div>
          </div>

          {/* Success Card */}
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mb-2 text-xl font-semibold text-foreground">Revisa tu email</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Te enviamos un enlace de verificación. Revisa tu bandeja de entrada para completar el registro.
            </p>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/login">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
