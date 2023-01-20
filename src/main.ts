import './components/AppRoot'
import { AppRoot } from './components/AppRoot'
import { router } from './router/routes'
import { store } from './store/Store'
import { StoreEvent } from './store/Store.types'



const appRoot = new AppRoot()
appRoot.store = store
store.addEventListener(StoreEvent.update, () => appRoot.requestUpdate())
router.attach(appRoot)

document.body.appendChild(appRoot)

