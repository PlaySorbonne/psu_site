const devMode: boolean = !!import.meta.env.PUBLIC_DEV_MODE;

const popupsData = devMode
  ? [
      {
        content:
          "Ce site est une demo ! Le site officiel est sur [playsorbonne.fr](https://playsorbonne.fr)",
        type: "floating" as const,
        position: "top",
        closeable: false,
      },
    ]
  : [];

export default popupsData;
