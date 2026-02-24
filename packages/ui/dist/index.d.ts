import * as react_jsx_runtime from 'react/jsx-runtime';
export { ColorToken, colors, cssVars } from './tokens/index.js';

interface LogoProps {
    /** Variante de cor: "dark" = texto branco (fundo escuro), "light" = texto escuro (fundo claro) */
    variant?: "dark" | "light";
    /** Largura em px. A altura é proporcional ao viewBox 133×37. */
    width?: number;
    className?: string;
}
/**
 * Logo oficial da Easy Goal.
 * O wordmark usa o SVG canônico do projeto com o ícone circular em laranja.
 *
 * @example
 * // Fundo escuro (padrão do app)
 * <Logo variant="dark" width={133} />
 *
 * // Fundo claro
 * <Logo variant="light" width={120} />
 */
declare function Logo({ variant, width, className }: LogoProps): react_jsx_runtime.JSX.Element;

export { Logo };
