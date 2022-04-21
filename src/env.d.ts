/**
 * Here the `Window` interface refers to 
 * https://developer.mozilla.org/en-US/docs/Web/API/Window.
 * 
 * By placing this declaration on this `env.d.ts` file,
 * we are augmenting the `Window` interface. 
 * For more info, see
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
 */
interface Window {
    /**
     * The `@metamask/providers` package is declared as a `devDependency` in `package.json`.
     * 
     * This is because only its type definitions are being used here.
     * See https://github.com/MetaMask/providers.
     *
     * MetaMask injects the `ethereum` provider at runtime.
     * Since MetaMask might not be installed in the user's browser,
     * the `ethereum` property might be `undefined`.
     */
    ethereum?: import("@metamask/providers").MetaMaskInpageProvider;
}
