const devMode: boolean = !!import.meta.env.PUBLIC_DEV_MODE;

const out = [
  devMode && {
    content:
      "Ce site est une demo ! Le site officiel est sur [playsorbonne.fr](https://playsorbonne.fr)",
    type: "floating",
    position: "top",
    closeable: false,
  },
];

export default out.filter((e) => e);
