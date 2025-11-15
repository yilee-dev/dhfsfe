type IMetaData = {
  title?: string;
  noIndex?: boolean;
};

export const MetaData = ({ title, noIndex }: IMetaData) => {
  return (
    <>
      <title>{`DONGHEE - ${title ? title + " |" : ""}`}</title>

      {noIndex && <meta name="robots" content="noindex" data-rh="true" />}
    </>
  );
};
