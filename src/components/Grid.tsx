import React from "react";

export const Container = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div className="max-w-[1200px] w-[calc(100%-40px)] mx-auto">
      {children}
    </div>
  );
};
