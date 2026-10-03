
export function Hero() {
    return (
        <section className="relative overflow-hidden bg-blue-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="max-w-3xl">
                    <span className="inline-flex items-center rounded-full bg-blue-500/50 px-3 py-1 text-sm font-medium text-blue-50 mb-4">
                        Transportasi Shuttle
                    </span>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                        Temukan Tempat Menginap nyaman <br />
                        
                        yang Kamu Butuhkan
                    </h1>

                    <p className="mt-5 max-w-2xl text-base sm:text-lg leading-7 text-blue-100">
                        Lihat berbagai pilihan hotel yang tersedia di kota tujuanmu, dan temukan tempat menginap yang sesuai dengan kebutuhanmu. Dengan berbagai fasilitas dan harga yang bersaing, kami siap membantu perjalananmu menjadi lebih nyaman dan menyenangkan.
                    </p>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-32 right-20 h-72 w-72 rounded-full bg-white/5" />
        </section>
    );
}
