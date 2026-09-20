import { Component } from 'react'

// Filet de sécurité : si la vérification de session échoue de façon
// inattendue (réponse non exploitable, panne réseau…), l'interface ne doit
// jamais rester plantée sur un écran blanc (§24.7 du cahier des charges :
// aucune interface ne doit laisser l'utilisateur dans l'incertitude).
// Découvert le 20/09/2026 en testant l'espace admin sans back-end réel :
// une réponse HTML inattendue sur /api/auth/get-session faisait planter
// l'arbre React sans message.
export default class ErreurAuth extends Component {
  state = { enErreur: false }

  static getDerivedStateFromError() {
    return { enErreur: true }
  }

  componentDidCatch(erreur) {
    console.error('Erreur dans l’espace admin :', erreur)
  }

  render() {
    if (!this.state.enErreur) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-light px-4">
        <div className="w-full max-w-sm bg-white border border-beige-dark rounded-2xl p-8 text-center">
          <p className="font-serif text-lg text-terre mb-2">Un problème est survenu</p>
          <p className="text-sm text-terre/70 leading-relaxed mb-6">
            L'espace d'administration n'a pas pu se charger correctement. Réessayez de vous connecter.
          </p>
          <a href="/admin/connexion" className="btn-ocre inline-block">
            Retour à la connexion
          </a>
        </div>
      </div>
    )
  }
}
