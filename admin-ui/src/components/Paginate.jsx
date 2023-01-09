export function Paginate(props) {
    return <div className="flex justify-between py-4">
        <button 
            className="btn btn-neutral" 
            classList={{
                'bg-gray-100': props.isPrevDisabled,
                'btn-neutral': !props.isPrevDisabled,
            }} 
            onClick={props.onPrev}
            disabled={props.isPrevDisabled}
        >prev</button>
        <button 
            className="btn"
            classList={{
                'bg-gray-100': props.isNextDisabled,
                'btn-neutral': !props.isNextDisabled,
            }} 
            onClick={props.onNext}
            disabled={props.isNextDisabled}
        >next</button>
    </div>
}