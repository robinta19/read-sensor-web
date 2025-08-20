import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    return (
            <div className='fixed flex justify-between items-center left-4 right-4 top-4 z-50 bg-white p-3 px-4 rounded-xl shadow-lg'>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100" />
                        <div className="font-semibold text-lg">Title</div>
                    </div>
                </div>
                {/* menu */}
                <div className="flex gap-6">
                    <Link
                        href={"/dashboard"}
                        className='text-blue-500 pb-1 border-b-2 border-blue-500 font-semibold'
                    >
                        Dashboard
                    </Link>
                    <Link
                        href={"/dashboard"}
                        className='hover:text-blue-500 hover:border-b-2 border-blue-500'
                    >
                        History
                    </Link>
                    <Link
                        href={"/dashboard"}
                        className='hover:text-blue-500 hover:border-b-2 border-blue-500'
                    >
                        Record Data
                    </Link>
                </div>
            </div>
    )
}

export default Navbar