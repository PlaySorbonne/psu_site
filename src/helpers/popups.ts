const devMode: boolean = !!import.meta.env.PUBLIC_DEV_MODE;

const out = [
  {
    content:
      "Les inscriptions pour [**la formation civique et citoyenne**](/formation) sont ouvertes !",
    type: "floating",
    position: "top",
  },
  devMode && {
    content: "Ce site est une demo ! Le site officiel est sur [playsorbonne.fr](https://playsorbonne.fr)",
    type: "floating",
    position: "top"
  }
];

export default out.filter(e => e);