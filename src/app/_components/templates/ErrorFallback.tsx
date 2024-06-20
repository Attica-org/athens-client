import { FallbackProps } from 'react-error-boundary';

type ErrorFallbackProps = FallbackProps & { headerLabel : string, btnLabel: string};

export default function ErrorFallback({error, resetErrorBoundary, headerLabel, btnLabel} : ErrorFallbackProps){
    return(
        <div className="flex-col">
            <p className="dark:text-white text-sm mt-12 text-center">{headerLabel}</p>
            <div className="w-full flex justify-center">
                <button className="bg-athens-main text-white rounded-full px-16 py-7 mt-20 text-sm justify-center items-center" 
                        type="button"
                        onClick={resetErrorBoundary}>
                    {btnLabel}
                </button>
            </div>
        </div>
    )
} 



