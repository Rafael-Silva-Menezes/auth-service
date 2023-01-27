export interface IBaseUseCaseProtocol<P, R> {
  exec(p: P, requestId?: string): R;
}
