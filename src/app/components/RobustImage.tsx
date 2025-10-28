// Robust Image Component with fallback handling
import Image from "next/image";
import { useState } from "react";

interface RobustImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  quality?: number;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  unoptimized?: boolean;
}

export default function RobustImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  loading = "lazy",
  quality = 85,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  unoptimized = false,
}: RobustImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to a placeholder image
      setImgSrc("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNTAgMjUwSDQ1MFYzNTBIMzUwVjI1MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM3NSAyNzVIMzUwVjI1MEgzNzVWMjc1WiIgZmlsbD0iI0QxRDVEQiIvPgo8cGF0aCBkPSJNMzUwIDI3NUgzNzVWMzAwSDM1MFYyNzVaIiBmaWxsPSIjRDFENURCIi8+CjxwYXRoIGQ9Ik0zNzUgMzAwSDM1MFYyNzVIMzc1VjMwMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM3NSAzMjVIMzUwVjMwMEgzNzVWMzI1WiIgZmlsbD0iI0QxRDVEQiIvPgo8cGF0aCBkPSJNMzUwIDMyNUgzNzVWMzUwSDM1MFYzMjVaIiBmaWxsPSIjRDFENURCIi8+CjxwYXRoIGQ9Ik0zNzUgMzUwSDM1MFYzMjVIMzc1VjM1MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1MCAzNzVIMzc1VjM1MEgzNTBWMzc1WiIgZmlsbD0iI0QxRDVEQiIvPgo8cGF0aCBkPSJNMzc1IDM3NUgzNTBWMzUwSDM3NVYzNzVaIiBmaWxsPSIjRDFENURCIi8+CjxwYXRoIGQ9Ik0zNzUgNDAwSDM1MFYzNzVIMzc1VjQwMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1MCA0MDBIMzc1VjM3NUgzNTBWNDAwWiIgZmlsbD0iI0QxRDVEQiIvPgo8cGF0aCBkPSJNMzc1IDQyNUgzNTBWNDAwSDM3NVY0MjVaIiBmaWxsPSIjRDFENURCIi8+CjxwYXRoIGQ9Ik0zNTAgNDI1SDM3NVY0MDBIMzUwVjQyNVoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM3NSA0NTBIMzUwVjQyNUgzNzVWNDUwWiIgZmlsbD0iI0QxRDVEQiIvPgo8cGF0aCBkPSJNMzUwIDQ1MEgzNzVWNDI1SDM1MFY0NTBaIiBmaWxsPSIjRDFENURCIi8+CjxwYXRoIGQ9Ik0zNzUgNDc1SDM1MFY0NTBIMzc1VjQ3NVoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1MCA0NzVIMzc1VjQ1MEgzNTBWNDc1WiIgZmlsbD0iI0QxRDVEQiIvPgo8cGF0aCBkPSJNMzc1IDUwMEgzNTBWNDc1SDM3NVY1MDBaIiBmaWxsPSIjRDFENURCIi8+CjxwYXRoIGQ9Ik0zNTAgNTAwSDM3NVY0NzVIMzUwVjUwMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM3NSA1MjVIMzUwVjUwMEgzNzVWNTI1WiIgZmlsbD0iI0QxRDVEQiIvPgo8cGF0aCBkPSJNMzUwIDUyNUgzNzVWNTAwSDM1MFY1MjVaIiBmaWxsPSIjRDFENURCIi8+CjxwYXRoIGQ9Ik0zNzUgNTUwSDM1MFY1MjVIMzc1VjU1MFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1MCA1NTBIMzc1VjUyNUgzNTBWNTUwWiIgZmlsbD0iI0QxRDVEQiIvPgo8cGF0aCBkPSJNMzc1IDU3NUgzNTBWNTUwSDM3NVY1NzVaIiBmaWxsPSIjRDFENURCIi8+CjxwYXRoIGQ9Ik0zNTAgNTc1SDM3NVY1NTBIMzUwVjU3NVoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM3NSA2MDBIMzUwVjU3NUgzNzVWNjAwWiIgZmlsbD0iI0QxRDVEQiIvPgo8cGF0aCBkPSJNMzUwIDYwMEgzNzVWNTc1SDM1MFY2MDBaIiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmaWxsPSIjOUNBM0FGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPgo=");
    }
  };

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    sizes,
    loading,
    quality,
    priority,
    placeholder,
    blurDataURL,
    unoptimized,
    onError: handleError,
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return (
    <Image
      {...imageProps}
      width={width || 800}
      height={height || 600}
    />
  );
}
