
// components/Footer.tsx

export function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                    {/* Brand */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900">
                            Transportasi
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Informasi rute dan layanan transportasi.
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Transportasi. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
