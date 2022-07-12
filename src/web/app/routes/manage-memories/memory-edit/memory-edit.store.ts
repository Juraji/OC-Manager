import {Injectable} from '@angular/core'
import {ComponentStore} from '@ngrx/component-store'
import {createEntityAdapter, EntityState} from '@ngrx/entity'
import {defaultIfEmpty, map, merge, mergeMap, Observable, tap, withLatestFrom} from 'rxjs'

import {numberSort, strSort} from '#core/arrays'
import {OcmApiCharactersService, OcmApiImagesService, OcmApiMemoriesService} from '#core/ocm-api'
import {filterNotNull, once} from '#core/rxjs'
import {OcCharacter} from '#models/characters.model'
import {OcImage} from '#models/images.model'
import {OcMemory} from '#models/memories.model'

interface MemoryEditStoreState {
  memory: Nullable<OcMemory>
  characters: EntityState<OcCharacter>
  availableCharacters: EntityState<OcCharacter>
  images: EntityState<OcImage>
}

@Injectable()
export class MemoryEditStore extends ComponentStore<MemoryEditStoreState> {

  private readonly characterAdapter = MemoryEditStore.createCharacterAdapter()
  private readonly characterSelectors = this.characterAdapter.getSelectors()

  private readonly imageAdapter = MemoryEditStore.createImageAdapter()
  private readonly imageSelectors = this.imageAdapter.getSelectors()

  readonly memoryId$ = this.select(s => s.memory?.id ?? null)
  readonly isNewMemory = this.memoryId$.pipe(map(id => !id))
  readonly memory$ = this.select(s => s.memory).pipe(filterNotNull())
  readonly characters$ = this
    .select(s => s.characters)
    .pipe(map(this.characterSelectors.selectAll))

  readonly availableCharacters: Observable<OcCharacter[]> = this
    .select(s => s.availableCharacters)
    .pipe(map(this.characterSelectors.selectAll))

  readonly filteredAvailableCharacters$ = this.characters$
    .pipe(
      map(cs => cs.map(e => e.id)),
      mergeMap(idsInUse => this.availableCharacters
        .pipe(map(available => available.filter(ac => !idsInUse.includes(ac.id)))))
    )

  readonly images$ = this
    .select(s => s.images)
    .pipe(map(this.imageSelectors.selectAll))

  constructor(
    private readonly memoriesService: OcmApiMemoriesService,
    private readonly imagesService: OcmApiImagesService,
    private readonly charactersService: OcmApiCharactersService,
  ) {
    super()

    this.setState({
      memory: null,
      characters: this.characterAdapter.getInitialState(),
      availableCharacters: this.characterAdapter.getInitialState(),
      images: this.imageAdapter.getInitialState()
    })
  }

  readonly loadOcMemory: (memory: OcMemory | null) => void = this.effect<OcMemory | null>($ => $.pipe(
    tap(memory => this.setState(s => ({
      memory,
      characters: this.characterAdapter.removeAll(s.characters),
      availableCharacters: this.characterAdapter.removeAll(s.characters),
      images: this.imageAdapter.removeAll(s.images)
    }))),
    filterNotNull(),
    mergeMap(memory => merge(
      this.memoriesService.getMemoryCharacters(memory.id)
        .pipe(tap(c => this.patchState(s => ({characters: this.characterAdapter.addOne(c, s.characters)})))),
      this.imagesService.getImagesByLinkedNodeId(memory.id)
        .pipe(tap(img => this.patchState(s => ({images: this.imageAdapter.addOne(img, s.images)})))),
      this.charactersService.getAllCharacters()
        .pipe(tap(c => this.patchState(s => ({availableCharacters: this.characterAdapter.addOne(c, s.availableCharacters)})))),
    ))
  ))

  saveMemory(changes: Partial<OcMemory>): Observable<OcMemory> {
    return this.memoryId$
      .pipe(
        once(),
        mergeMap(id => !!id ? this.memory$ : [{} as OcMemory]),
        once(),
        defaultIfEmpty({} as OcMemory),
        map(memory => ({...memory, ...changes})),
        mergeMap(memory => this.memoriesService.saveMemory(memory)),
        tap(memory => this.patchState({memory}))
      )
  }

  deleteMemory() {
    return this.memoryId$
      .pipe(
        once(),
        filterNotNull(),
        mergeMap(id => this.memoriesService.deleteMemory(id))
      )
  }

  readonly addCharacter: (characterId: string) => void = this.effect<string>($ => $.pipe(
    withLatestFrom(this.memoryId$.pipe(filterNotNull())),
    mergeMap(([characterId, memoryId]) => this.memoriesService.addCharacterToMemory(memoryId, characterId)),
    tap(character => this.patchState(s => ({
      characters: this.characterAdapter.addOne(character, s.characters)
    })))
  ))

  readonly removeCharacter: (characterId: string) => void = this.effect<string>($ => $.pipe(
    withLatestFrom(this.memoryId$.pipe(filterNotNull())),
    mergeMap(([characterId, memoryId]) => this.memoriesService
      .removeCharacterFromMemory(memoryId, characterId)
      .pipe(map(() => characterId))),
    tap(characterId => this.patchState(s => ({
      characters: this.characterAdapter.removeOne(characterId, s.characters)
    })))
  ))

  readonly addImages: (f: FileList) => void = this.effect<FileList>($ => $.pipe(
    mergeMap(l => l),
    withLatestFrom(this.memoryId$.pipe(filterNotNull())),
    mergeMap(([f, memoryId]) => this.imagesService.saveImage(f, memoryId)),
    tap(image => this.patchState(s => ({
      images: this.imageAdapter.addOne(image, s.images)
    })))
  ))

  readonly removeImage: (imageId: string) => void = this.effect<string>($ => $.pipe(
    mergeMap(imageId => this.imagesService.deleteImage(imageId).pipe(map(() => imageId))),
    tap(imageId => this.patchState(s => ({
      images: this.imageAdapter.removeOne(imageId, s.images)
    })))
  ))

  private static createCharacterAdapter() {
    return createEntityAdapter<OcCharacter>({
      selectId: e => e.id,
      sortComparer: strSort(e => e.name)
    })
  }

  private static createImageAdapter() {
    return createEntityAdapter<OcImage>({
      selectId: e => e.id,
      sortComparer: numberSort(e => e.uploadedOn)
    })
  }
}
