import "./main.less";

import { use } from "@ophidian/core";
import type { App, PluginManifest } from "obsidian";
import { Plugin } from "obsidian";

import checkLib from "./install-guide/index.jsx";
import { NoteFields } from "./note-feature/note-fields/service";
import NoteFeatures from "./note-feature/service";
import { AnnotBlock } from "./services/annot-block/service";
import { CitekeyClick } from "./services/citekey-click/service";
import NoteIndex from "./services/note-index/service.js";
import PDFParser from "./services/pdf-parser/service";
import { Server } from "./services/server/service";
import {
  TemplateComplier,
  TemplateLoader,
  TemplateRenderer,
} from "./services/template";
import { TemplateEditorHelper } from "./services/template/editor/service";
import { TopicImport } from "./services/topic-import/service";
import DatabaseWatcher from "./services/zotero-db/auto-refresh/service";
import DatabaseWorker from "./services/zotero-db/connector/service";
import { ZoteroDatabase } from "./services/zotero-db/database";
import { ImgCacheImporter } from "./services/zotero-db/img-import/service";
import { ZoteroSettingTab } from "./setting-tab/index.js";
import { SettingLoader } from "./settings/service.js";
import log from "@/log";

declare global {
  // eslint-disable-next-line no-var
  var zt: ZoteroPlugin | undefined;
}

export default class ZoteroPlugin extends Plugin {
  use = use.plugin(this);

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    if (!checkLib(manifest)) {
      throw new Error("Library check failed");
    }
    // this.noteParser = new NoteParser(this);
  }

  settings = this.use(SettingLoader);

  noteIndex = this.use(NoteIndex);
  noteFields = this.use(NoteFields);
  server = this.use(Server);
  topicImport = this.use(TopicImport);
  citekeyClick = this.use(CitekeyClick);
  templateEditor = this.use(TemplateEditorHelper);
  noteFeatures = this.use(NoteFeatures);

  get databaseAPI() {
    return this.dbWorker.api;
  }
  dbWorker = this.use(DatabaseWorker);
  imgCacheImporter = this.use(ImgCacheImporter);
  dbWatcher = this.use(DatabaseWatcher);
  database = this.use(ZoteroDatabase);

  templateRenderer = this.use(TemplateRenderer);
  templateComplier = this.use(TemplateComplier);
  templateLoader = this.use(TemplateLoader);

  annotBlockWorker = this.use(AnnotBlock);
  pdfParser = this.use(PDFParser);

  async onload() {
    log.info("loading Obsidian Zotero Plugin");
    this.addSettingTab(new ZoteroSettingTab(this));

    // globalThis.zt = this;
    // this.register(() => delete globalThis.zt);

    // this.registerEvent(
    //   this.server.on("zotero/export", (p) => console.warn(parseQuery(p))),
    // );
    // this.registerEvent(
    //   this.server.on("zotero/open", (p) => console.warn(parseQuery(p))),
    // );
  }

  onunload() {
    log.info("unloading Obsidian Zotero Plugin");
  }
}
