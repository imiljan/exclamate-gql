import * as fs from 'fs';
import shortid = require('shortid');

import { UPLOAD_DIR } from '../..';
import { Resolvers } from '../../generated/graphql';

// import { getLogger } from 'log4js';
// const logger = getLogger('commentResolvers.ts');

const storeFS = ({ stream, filename }: any): Promise<{ id: string; path: string }> => {
  const id = shortid.generate();
  const path = `${UPLOAD_DIR}/${id}-${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .on('error', (error: any) => {
        if (stream.truncated) {
          // Delete the truncated file.
          fs.unlinkSync(path);
        }
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', (error: any) => reject(error))
      .on('finish', () => resolve({ id, path }))
  );
};

export const resolvers: Resolvers = {
  Query: {},
  Mutation: {
    singleUpload: async (_, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const stream = createReadStream();
      const { id, path } = await storeFS({ stream, filename });
      console.log(`id: ${id}`);
      console.log(`path: ${path}`);
      return { filename, mimetype, encoding };
      // return storeDB({ id, filename, mimetype, path });
    },
  },
};
