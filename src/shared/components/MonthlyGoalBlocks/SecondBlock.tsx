import * as motion from "motion/react-client";

interface ISecondBlockProps {
  t: {
    octoberGoal: string;
    vaccinationArgumentsTitle: string;
    arguments: string[];
    conclusion: string;
  };
}

const SecondBlock = ({ t }: ISecondBlockProps) => {
  return (
    <motion.div
      className="bg-white p-5 xl:px-[77px] xl:py-[45px] rounded-[16px] flex flex-col gap-6 xl:w-1/2 xl:mb-[47px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: 0.6 },
        },
      }}
    >
      <motion.p
        className="numeric-font text-dark text-[18px] leading-[130%]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.6, delay: 0.7 } },
        }}
        dangerouslySetInnerHTML={{ __html: t.octoberGoal }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: 0.8 },
          },
        }}
      >
        <motion.h2
          className="numeric-font text-dark text-[18px] leading-[130%] font-bold"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6, delay: 0.9 } },
          }}
        >
          {t.vaccinationArgumentsTitle}
        </motion.h2>

        <motion.ul
          className="list-disc pl-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 1.0 },
            },
          }}
        >
          {t.arguments.map((argument, index) => (
            <motion.li
              key={index}
              className="numeric-font text-dark text-[18px] leading-[130%]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: 1.1 + index * 0.2 },
                },
              }}
            >
              {argument}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.p
        className="numeric-font text-dark text-[18px] leading-[130%]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.6, delay: 1.8 } },
        }}
      >
        {t.conclusion}
      </motion.p>
    </motion.div>
  );
};

export default SecondBlock;
