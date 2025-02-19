import {
  log,
}           from '../config.js'

import type { PuppetSkeleton } from '../puppet/puppet-skeleton.js'

const loginMixin = <MixinBase extends typeof PuppetSkeleton>(mixinBase: MixinBase) => {

  abstract class LoginMixin extends mixinBase {

    /**
     * @internal used by public API `currentUserId`
     */
    _currentUserId?: string

    get currentUserId (): string {
      log.verbose('PuppetLoginMixin', 'get currentUserId()')

      if (!this._currentUserId) {
        throw new Error('not logged in, no this.currentUserId yet.')
      }

      return this._currentUserId
    }

    constructor (...args: any[]) {
      super(...args)
      log.verbose('PuppetLoginMixin', 'constructor()')
    }

    override async start (): Promise<void> {
      log.verbose('PuppetLoginMixin', 'start()')
      await super.start()
    }

    override async stop (): Promise<void> {
      log.verbose('PuppetLoginMixin', 'stop()')
      await this.logout()
      await super.stop()
    }

    /**
     * Need to be called internally when the puppet is logined.
     * this method will emit a `login` event
     * @internal for puppet internal usage
     */
    login (userId: string): void {
      log.verbose('PuppetLoginMixin', 'login(%s)', userId)

      if (this._currentUserId) {
        throw new Error('must logout first before login again!')
      }
      this._currentUserId = userId

      this.emit('login', { contactId: userId })
    }

    /**
     * Need to be called internally/externally when the puppet need to be logouted
     * this method will emit a `logout` event,
     *
     * Note: must set `this.currentUserId = undefined` in this function.
     */
    logout (reason = 'logout()'): void {
      log.verbose('PuppetLoginMixin', 'logout(%s)', reason)

      if (!this.logonoff()) {
        log.verbose('PuppetLoginMixin', 'logout() no currentUserId, do nothing')
        return
      }

      this.emit('logout', {
        contactId : this.currentUserId,
        data      : reason,
      })

      /**
       * Huan(202111): We postpone the `this._currentUserId = undefined` to here,
       *  in case of the `logout` event listener need to check the `this.currentUserId`
       */
      setImmediate(() => { this._currentUserId = undefined })
    }

    /**
     * @deprecated use `currentUserId` instead. (will be removed after Dec 31, 2022)
     */
    selfId (): string {
      log.warn('PuppetLoginMixin',
        'selfId() is deprecated, use `currentUserId` instead:\n%s',
        new Error().stack,
      )
      return this.currentUserId
    }

    logonoff (): boolean {
      if (this._currentUserId) {
        return true
      } else {
        return false
      }
    }

  }

  return LoginMixin
}

type LoginMixin = ReturnType<typeof loginMixin>

type ProtectedPropertyLoginMixin =
  | 'login'
  | '_currentUserId'

export type {
  LoginMixin,
  ProtectedPropertyLoginMixin,
}
export { loginMixin }
