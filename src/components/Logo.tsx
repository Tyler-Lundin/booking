import Image from 'next/image';
import Link from 'next/link';

export function LogoFull() {
  return (
    <Link href="/" className={`flex items-center relative space-x-1`}>
        <>


          <span className="text-2xl font-light text-gray-900 tracking-tight">
            <ol className="flex items-center space-x-1 uppercase">
              <li>s</li>
              <li>l</li>
              <li className="relative w-6 h-6 bg-gray-900 rounded-full group">    
                <div className="absolute top-0 left-0 -translate-x-0 -z-10 scale-0 group-hover:scale-100 group-hover:-translate-x-1/2 transition-all rotate-0 group-hover:-rotate-45 duration-300">
                  <FoxTail size="w-5 h-5" />
                </div>
                <Image
                src="/assets/fox-head.png"
                alt="Fox Head Logo"
                fill
                className="object-contain "
                priority
              /></li>
              <li>t</li>
            </ol>
          </span>
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text">
            FOX
          </span>
        </>
    </Link>
  );
} 

export function LogoShort() {
  return (
    <Link href="/" className={`flex items-center space-x-1`}>
      <div className="relative w-8 h-8">
        <Image
          src="/assets/fox-head.png"
          alt="Fox Head Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
        FOX
      </span>
    </Link>
  );
}


export function FoxHead({ size = 'w-8 h-8', className }: { size?: string; className?: string }) {
  return (
    <div className={`relative ${size} ${className || ''}`}>
      <Image src="/assets/fox-head.png" sizes={"100%"} alt="Fox Head Logo" fill className="object-contain" priority />
    </div>
  );
}

export function FoxTail({ size = 'w-8 h-8' }: { size?: string }) {
  return (
    <div className={`relative ${size}`}>
      <Image src="/assets/fox-tail.png" alt="Fox Tail Logo" fill className="object-contain" priority />
    </div>
  );
}