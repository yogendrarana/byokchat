export function Logo() {
    return (
        <div className="flex items-center space-x-3 group">
            <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-lg group-hover:shadow-emerald-200 transition-all duration-300" />
                <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500" />
            </div>
        </div>
    );
}
