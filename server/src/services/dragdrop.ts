import type { Core } from '@strapi/strapi';
import type * as StrapiTypes from '@strapi/types/dist';
import { PluginSettingsResponse, RankUpdate } from '../../../typings';

const dragdrop = ({ strapi }: { strapi: Core.Strapi }) => ({
  getWelcomeMessage() {
    return {
      body: 'Welcome to Strapi 🚀',
    };
  },

  async sortIndex(
    contentType: StrapiTypes.UID.CollectionType,
    start: number,
    limit: number,
    locale: string,
    rankFieldName: string
  ) {
    let indexData = {
      sort: {},
      populate: '*',
      start: start,
      limit: limit,
      locale: locale,
    };
    indexData.sort[rankFieldName] = 'asc';
    try {
      return await strapi.documents(contentType).findMany(indexData);
    } catch (err) {
      return {};
    }
  },

  /**
   *
   * @param {RankUpdate[]} updates
   * @param {StrapiTypes.UID.CollectionType} contentType
   */
  async batchUpdate(
    config: PluginSettingsResponse,
    updates: RankUpdate[],
    contentType: StrapiTypes.UID.CollectionType
  ) {
    const shouldTriggerWebhooks = config.body.triggerWebhooks;
    const sortFieldName = config.body.rank;
    const results = [];

    strapi['apiUpdate'] = true;

    for (const update of updates) {
      const allLocalizations = await strapi.db.query(contentType).findOne({
        where: { id: update.id },
        populate: ['localizations'],
      });

      const { localizations, ...origin } = allLocalizations;
      for (const entry of [origin, ...localizations]) {
        const updatedEntry = await strapi.db.query(contentType).update({
          where: { id: entry.id },
          data: {
            [sortFieldName]: update.rank,
          },
        });

        if (updatedEntry?.id) {
          results.push(updatedEntry);
        }
      }

      // Trigger webhook listener for updated entry
      //see: https://forum.strapi.io/t/trigger-webhook-event-from-api/35919/5
      if (shouldTriggerWebhooks) {
        const info: Record<string, unknown> = {
          model: contentType.split('.').at(-1),
          entry: {
            id: origin.id,
            ...origin,
          },
        };

        await strapi.get('webhookRunner').executeListener({
          event: 'entry.update',
          info,
        });
      }
    }

    strapi['apiUpdate'] = undefined;

    return results.map((entry) => ({
      id: entry.id,
      rank: entry[sortFieldName],
    }));
  },
});

export default dragdrop;
